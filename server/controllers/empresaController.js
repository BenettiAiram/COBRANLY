const empresaModel = require("../models/empresaModel.js")

module.exports = {
  renderizarCadastro: async (req, res) => {
    try {
      const usuarios = await empresaModel.listarResponsaveis()
      res.render("empresas/cadastrar", { usuarios })
    } catch (erro) {
      console.error(erro)
      res.status(500).render("erro", { mensagem: "Erro ao abrir tela de cadastro de empresa" })
    }
  },

  cadastrar: async (req, res) => {
    try {
      const { nome, email, encarregado, cnpj, telefone, bairro, cidade, estado } = req.body

      if (!nome || !email || !encarregado || !cnpj || !telefone || !bairro || !cidade || !estado) {
        return res.status(400).render("erro", { mensagem: "Preencha todos os campos obrigatórios" })
      }

      const encarregadoId = Number(encarregado)

      if (!Number.isInteger(encarregadoId) || encarregadoId <= 0) {
        return res.status(400).render("erro", { mensagem: "Selecione um responsável válido" })
      }

      await empresaModel.criarEmpresa(nome, email, encarregadoId, cnpj, telefone, bairro, cidade, estado)

      res.redirect("/empresas/listar")
    } catch (erro) {
      console.error(erro)

      if (erro.code === "ER_DUP_ENTRY") {
        return res.status(400).render("erro", { mensagem: "Já existe uma empresa com esses dados" })
      }

      res.status(500).render("erro", { mensagem: "Erro ao cadastrar empresa" })
    }
  },

  listar: async (req, res) => {
    try {
      const empresas = await empresaModel.listarEmpresas()
      res.render("empresas/listar", { empresas })
    } catch (erro) {
      console.error(erro)
      res.status(500).render("erro", { mensagem: "Erro ao listar empresas" })
    }
  }
}
