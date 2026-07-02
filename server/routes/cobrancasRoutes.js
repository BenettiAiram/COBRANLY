const express = require("express")
const router = express.Router()

const { verificarAutenticacao, somenteCobradorOuAdministrador } = require("../middlewares/authMiddleware.js")
const cobrancaController = require("../controllers/cobrancaController.js")
const cobrancaCreateController = require("../controllers/cobrancaCreateController.js")

router.use(verificarAutenticacao)

router.get("/listar", verificarAutenticacao, cobrancaController.listar)

router.get("/cadastro", somenteCobradorOuAdministrador, cobrancaCreateController.renderCadastrar)
router.post("/cadastro", somenteCobradorOuAdministrador, cobrancaCreateController.cadastrar)

router.get("/editar/:id", somenteCobradorOuAdministrador, cobrancaController.editar)
router.post("/atualizar/:id", somenteCobradorOuAdministrador, cobrancaController.atualizar)
router.post("/deletar/:id", somenteCobradorOuAdministrador, cobrancaController.deletar)
router.get("/relatorio", somenteCobradorOuAdministrador, cobrancaController.relatorio)

module.exports = router
