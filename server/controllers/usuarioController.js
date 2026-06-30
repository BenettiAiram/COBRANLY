const usuarioModel = require("../models/usuarioModel.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

function obterUsuarioLogado(req) {
    const token = req.cookies?.token

    if (!token) return null

    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (erro) {
        return null
    }
}

module.exports = {
    login: async (req, res) => {
        try {
            const { email, senha } = req.body
            const usuario = await usuarioModel.buscarPorEmail(email)

            if (!usuario) {
                return res.status(404).render("erro", { mensagem: "Credenciais invalidas" })
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha)

            if (!senhaValida) {
                return res.status(404).render("erro", { mensagem: "Credenciais invalidas" })
            }

            const token = jwt.sign(
                { id: usuario.id, perfil: usuario.perfil, nome: usuario.nome },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            )

            res.cookie("token", token, { httpOnly: true })

            if (usuario.perfil === "administrador") return res.redirect("/usuarios/listar")
            if (usuario.perfil === "cobrador") return res.redirect("/usuarios/listarDevedores")
            if (usuario.perfil === "devedor") return res.redirect("/usuarios/listarDevedores")

            return res.redirect("/login")
        } catch (erro) {
            console.error(erro)
            res.status(500).render("erro", { mensagem: "Erro interno no servidor" })
        }
    },

    logout: (req, res) => {
        res.clearCookie("token")
        res.redirect("/login")
    },

    renderizarCadastro: (req, res) => {
        res.render("usuarios/cadastrar")
    },

    cadastrar: async (req, res) => {
        try {
            const { nome, email, senha, telefone, perfil } = req.body
            const perfisPermitidos = ["administrador", "cobrador", "devedor"]
            const usuarioLogado = obterUsuarioLogado(req)

            if (!perfisPermitidos.includes(perfil)) {
                return res.status(400).render("erro", { mensagem: "Perfil invalido" })
            }

            if (perfil === "administrador" && usuarioLogado?.perfil !== "administrador") {
                return res.status(403).render("erro", { mensagem: "Voce nao possui acesso" })
            }

            const fotoDaPessoa = req.file ? `/uploads/usuarios/${req.file.filename}` : null
            const senhaHash = await bcrypt.hash(senha, 10)

            await usuarioModel.criarUsuario(nome, email, senhaHash, telefone, fotoDaPessoa, perfil)

            let redirecionadoPara = "/login"

            if (usuarioLogado?.perfil === "administrador") {
                redirecionadoPara = "/usuarios/listar"
            } else if (usuarioLogado?.perfil === "cobrador" || usuarioLogado?.perfil === "devedor") {
                redirecionadoPara = "/usuarios/listarDevedores"
            }

            res.redirect(redirecionadoPara)
        } catch (erro) {
            console.error(erro)
            res.status(500).render("erro", { mensagem: "Erro ao cadastrar usuario" })
        }
    },

    listar: async (req, res) => {
        try {
            const usuarios = await usuarioModel.listarUsuarios()
            res.render("usuarios/listar", { usuarios })
        } catch (erro) {
            console.error(erro)
            res.status(500).render("erro", { mensagem: "Erro ao listar usuarios" })
        }
    },

    listarDevedores: async (req, res) => {
        try {
            const usuarios = await usuarioModel.listarDevedores()
            res.render("usuarios/listarDevedores", { usuarios })
        } catch (erro) {
            console.error(erro)
            res.status(500).render("erro", { mensagem: "Erro ao listar devedores" })
        }
    },

    deletar: async (req, res) => {
        try {
            const idVindoDaUrl = req.params.id
            await usuarioModel.deletarUsuario(idVindoDaUrl)
            res.redirect("/usuarios/listar")
        } catch (erro) {
            console.error(erro)
            res.status(500).render("erro", { mensagem: "Erro ao deletar usuario" })
        }
    },

    editar: async (req, res) => {
        try {
            const idVindoDaUrl = req.params.id
            const usuarioEditado = await usuarioModel.buscarPorId(idVindoDaUrl)

            if (!usuarioEditado) {
                return res.status(404).render("erro", { mensagem: "Usuario nao encontrado" })
            }

            res.render("usuarios/editar", { usuarioEditado })
        } catch (erro) {
            console.error(erro)
            res.status(500).render("erro", { mensagem: "Erro ao abrir tela de edicao" })
        }
    },

    atualizarUsuario: async (req, res) => {
        try {
            const idVindoDaUrl = req.params.id
            const { nome, email, senha, telefone, perfil } = req.body
            const perfisPermitidos = ["administrador", "cobrador", "devedor"]

            if (!perfisPermitidos.includes(perfil)) {
                return res.status(400).render("erro", { mensagem: "Perfil invalido" })
            }

            const usuarioAntigo = await usuarioModel.buscarPorId(idVindoDaUrl)

            if (!usuarioAntigo) {
                return res.status(404).render("erro", { mensagem: "Usuario nao encontrado" })
            }

            const fotoDaPessoa = req.file ? `/uploads/usuarios/${req.file.filename}` : usuarioAntigo.foto
            const senhaHash = senha && senha.trim() !== ""
                ? await bcrypt.hash(senha, 10)
                : usuarioAntigo.senha

            await usuarioModel.atualizarUsuario(idVindoDaUrl, nome, email, senhaHash, telefone, fotoDaPessoa, perfil)
            res.redirect("/usuarios/listar")
        } catch (erro) {
            console.error(erro)
            res.status(500).render("erro", { mensagem: "Erro ao editar usuario" })
        }
    },

    RecuperarSenha: async (req, res) => {
        try {
            res.render("auth/recuperar_senha")
        } catch (erro) {
            console.error(erro)
            res.status(500).render("erro", { mensagem: "Erro ao abrir tela de recuperacao de senha" })
        }
    },

    enviarRecuperacaoSenha: async (req, res) => {
        try {
            res.render("auth/recuperar_senha", {
                success: "Se o e-mail estiver cadastrado, enviaremos as instrucoes de recuperacao.",
                formData: req.body
            })
        } catch (erro) {
            console.error(erro)
            res.status(500).render("erro", { mensagem: "Erro ao solicitar recuperacao de senha" })
        }
    }
}
