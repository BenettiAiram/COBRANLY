// importação do módulo express
const express = require("express");
const router = express.Router();

// Importar o controller do usuario
const usuarioController = require("../controllers/usuarioController.js")

// Importar o multer
const upload = require("../config/multer.js")

// Importar o middleware de autenticação
const { verificarAutenticacao, somenteAdmin } = require("../middlewares/authMiddleware.js")

// Declaração das rotas do usuário
// ROTAS PÚBLICAS
// Envia os dados de login
router.post("/login", usuarioController.login)
// Rota de saida
router.get("/logout", usuarioController.logout)
// Rota de recuperação de senha
router.get("/recuperar_senha", usuarioController.RecuperarSenha)
router.post("/recuperar_senha", usuarioController.enviarRecuperacaoSenha)

// ROTAS PÚBLICAS PARA CADASTRO
router.get("/cadastro", usuarioController.renderizarCadastro);
router.post('/cadastrar', upload.single('foto'), usuarioController.cadastrar )

// ROTAS PRIVADAS
// Daqui pra baixo, só executa se tiver acesso para tal
router.use(verificarAutenticacao)

router.get("/listarDevedores", usuarioController.listarDevedores);

// CRUD
// READ - LISTAR USUÁRIOS
// Obtém a lista de usuários
router.get("/listar", somenteAdmin, usuarioController.listar);

// DELETE - DELETAR UM USUÁRIO
router.post("/deletar/:id", somenteAdmin, usuarioController.deletar)

// UPDATE - LISTA UM USUÁRIO
router.get("/editar/:id", somenteAdmin, usuarioController.editar)

// UPDATE - ATUALIZA AS INFORMAÇOES DE UM USUÁRIO
router.post("/atualizar/:id", somenteAdmin, upload.single('foto'), usuarioController.atualizarUsuario)

module.exports = router
