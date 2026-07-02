const cobrancaModel = require("../models/cobrancaModel.js")

function formatDate(value) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toISOString().slice(0, 10)
}

module.exports = {
  listar: async (req, res) => {
    try {
      const cobrancasBrutas = req.usuario.perfil === 'devedor'
        ? await cobrancaModel.listarCobrancasPorUsuario(req.usuario.id)
        : await cobrancaModel.listarCobrancas()

      const cobrancas = cobrancasBrutas.map((cobranca) => {
        const jurosTexto = cobranca.juros ? cobranca.juros.toString().trim().replace(/%/g, '') : ''
        const normalizedStatus = (cobranca.status || '').toLowerCase().trim()
        const statusClass = normalizedStatus === 'paga' ? 'status-pago' : `status-${normalizedStatus}`

        return {
          ...cobranca,
          jurosExibicao: jurosTexto ? `${jurosTexto}%` : '-',
          statusClass,
          statusLabel: cobranca.status || '-',
          dataVencimento: formatDate(cobranca.dataVencimento)
        }
      })

      res.render("cobrancas/listar", { cobrancas, usuario: req.usuario })
    } catch (erro) {
      console.error(erro)
      res.status(500).render("erro", { mensagem: "Erro ao listar cobranças" })
    }
  },

  editar: async (req, res) => {
    try {
      const cobranca = await cobrancaModel.buscarPorId(req.params.id)
      const empresas = await require("../models/empresaModel.js").listarEmpresas()
      const devedores = await require("../models/usuarioModel.js").listarDevedores()

      if (!cobranca) {
        return res.status(404).render("erro", { mensagem: "Cobrança não encontrada" })
      }

      res.render("cobrancas/editar", { cobranca, empresas, devedores })
    } catch (erro) {
      console.error(erro)
      res.status(500).render("erro", { mensagem: "Erro ao abrir formulário de edição" })
    }
  },

  atualizar: async (req, res) => {
    try {
      const { valor, status, juros, dataVencimento, empresaId, usuarioId } = req.body

      if (!valor || !status || !juros || !dataVencimento || !empresaId || !usuarioId) {
        return res.status(400).render("erro", { mensagem: "Todos os campos são obrigatórios" })
      }

      const valorFormatado = Number(valor.replace(/\./g, "").replace(/,/g, "."))
      const jurosFormatado = juros.toString().replace(/%/g, "").trim()
      const dataCriacao = new Date().toISOString().slice(0, 10)

      await cobrancaModel.atualizarCobranca(
        req.params.id,
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
      res.status(500).render("erro", { mensagem: "Erro ao atualizar cobrança" })
    }
  },

  deletar: async (req, res) => {
    try {
      await cobrancaModel.deletarCobranca(req.params.id)
      res.redirect("/cobrancas/listar")
    } catch (erro) {
      console.error(erro)
      res.status(500).render("erro", { mensagem: "Erro ao deletar cobrança" })
    }
  },

  relatorio: async (req, res) => {
    try {
      const cobrancas = await cobrancaModel.listarCobrancas()
      const cobrancasFormatadas = cobrancas.map(cobranca => ({
        ...cobranca,
        valor: Number(cobranca.valor || 0).toFixed(2),
        juros: Number(cobranca.juros || 0).toFixed(2),
        dataVencimento: formatDate(cobranca.dataVencimento),
        dataCriacao: formatDate(cobranca.dataCriacao)
      }))

      const totalDividas = cobrancasFormatadas.reduce(
        (sum, item) => sum + Number(item.valor || 0),
        0
      )
      const totalPendentes = cobrancasFormatadas
        .filter(item => item.status === "pendente")
        .reduce((sum, item) => sum + Number(item.valor || 0), 0)
      const totalPagas = cobrancasFormatadas
        .filter(item => item.status === "pago")
        .reduce((sum, item) => sum + Number(item.valor || 0), 0)

      res.render("cobrancas/relatorio", {
        cobrancas: cobrancasFormatadas,
        totalDividas,
        totalPendentes,
        totalPagas
      })
    } catch (erro) {
      console.error(erro)
      res.status(500).render("erro", { mensagem: "Erro ao gerar relatório de cobranças" })
    }
  }
}
