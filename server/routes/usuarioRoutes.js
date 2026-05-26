// importação do módulo express
const express = require("express");
const router = express.Router();

// Importar o controller do usuario
const usuarioController = require("../controllers/usuarioController.js")

// Importar o multer
const upload = require("../config/multer.js")

// Importar o middleware de autenticacao,
const { verificarAutenticacao, somenteAdmin } = require("../middlewares/authMiddleware.js");

// Declaração das rotas do usuário
// ROTAS PÚBLICAS
// Envia os dados de login
router.post("/login", usuarioController.login)

// Rota de saida
router.get("/logout", usuarioController.logout)

// Rota de cadastro de usuário
// o multer salva a img primeiro, atrvés do upload.single, depois chama o contreller
router.post("/cadastrar", upload.single('foto'), usuarioController.cadastar)

// ROTAS PRIVADAS
// Daqui p/ baixo, só executa se tiver acesso para tal
router.use(verificarAutenticacao);
router.use(somenteAdmin);

// Obtém a lista de usuários
router.get("/", (req, res) => {
  res.json({ mensagem: "Peguei a lista de usuários" });
});

//Retornar a página de cadastro
router.get("/cadastro", (req, res) => {
  res.json({ mensagem: "Estou na página de cadastro" });
});


module.exports = router