const express = require("express")
const router = express.Router()

const { verificarAutenticacao } = require("../middlewares/authMiddleware.js")

router.use(verificarAutenticacao)

router.get("/listar", (req, res) => {
  res.render("empresas/listar", { empresas: [] })
})

router.get("/cadastro", (req, res) => {
  res.render("empresas/cadastrar")
})

module.exports = router
