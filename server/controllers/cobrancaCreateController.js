const empresaModel = require("../models/empresaModel.js")
const usuarioModel = require("../models/usuarioModel.js")
const cobrancaCreateModel = require("../models/cobrancaCreateModel.js")

module.exports = {
  renderCadastrar: async (req, res) => {
    try {
      const empresas = await empresaModel.listarEmpresas()
      const devedores = await usuarioModel.listarDevedores()
      res.render("cobrancas/cadastrar", { empresas, devedores })
    } catch (erro) {
      console.error(erro)
      res.status(500).render("erro", { mensagem: "Erro ao abrir formulário de cobrança" })
    }
  },

  cadastrar: async (req, res) => {
    try {
      const { valor, status, juros, dataVencimento, empresaId, usuarioId } = req.body

      if (!valor || !status || !juros || !dataVencimento || !empresaId || !usuarioId) {
        return res.status(400).render("erro", { mensagem: "Todos os campos são obrigatórios" })
      }

      const valorFormatado = Number(valor.replace(/\./g, "").replace(/,/g, "."))
      const jurosFormatado = juros.toString().replace(/%/g, "").trim()
      const dataCriacao = new Date().toISOString().slice(0, 10)

      await cobrancaCreateModel.criarCobranca(
        valorFormatado,
        status,
        jurosFormatado,
        dataVencimento,
        dataCriacao,
        empresaId,
        usuarioId
      )

      res.redirect("/cobrancas/listar")
    } catch (erro) {
      console.error(erro)
      res.status(500).render("erro", { mensagem: "Erro ao cadastrar cobrança" })
    }
  }
}
