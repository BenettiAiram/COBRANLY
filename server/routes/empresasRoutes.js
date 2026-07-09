const express = require("express")
const router = express.Router()

const empresaController = require("../controllers/empresaController.js")
const { verificarAutenticacao, somenteAdmin } = require("../middlewares/authMiddleware.js")

router.use(verificarAutenticacao)

router.get("/listar", empresaController.listar)
router.get("/cadastro", empresaController.renderizarCadastro)
router.post("/cadastrar", empresaController.cadastrar)

router.use(somenteAdmin)

module.exports = router
