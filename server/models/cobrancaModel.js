const db = require("../config/db.js")

module.exports = {
  listarCobrancas: async () => {
    const query = `
      SELECT
        c.id_cobranca AS id,
        c.valor_divida AS valor,
        c.status_cobranca AS status,
        c.juros_cobranca AS juros,
        c.data_vencimento AS dataVencimento,
        c.data_criacao AS dataCriacao,
        e.id_empresa AS empresaId,
        e.nome_empresa AS empresa,
        u.id_usuario AS usuarioId,
        u.nome_usuario AS devedor
      FROM cobranca c
      JOIN empresa e ON c.empresa_id_empresa = e.id_empresa
      JOIN usuarios u ON c.usuario_id_usuario = u.id_usuario
      ORDER BY c.data_vencimento ASC
    `

    const [linhas] = await db.execute(query)
    return linhas
  },

  listarCobrancasPorUsuario: async (usuarioId) => {
    const query = `
      SELECT
        c.id_cobranca AS id,
        c.valor_divida AS valor,
        c.status_cobranca AS status,
        c.juros_cobranca AS juros,
        c.data_vencimento AS dataVencimento,
        c.data_criacao AS dataCriacao,
        e.id_empresa AS empresaId,
        e.nome_empresa AS empresa,
        u.id_usuario AS usuarioId,
        u.nome_usuario AS devedor
      FROM cobranca c
      JOIN empresa e ON c.empresa_id_empresa = e.id_empresa
      JOIN usuarios u ON c.usuario_id_usuario = u.id_usuario
      WHERE c.usuario_id_usuario = ?
      ORDER BY c.data_vencimento ASC
    `

    const [linhas] = await db.execute(query, [usuarioId])
    return linhas
  },

  buscarPorId: async (id) => {
    const query = `
      SELECT
        c.id_cobranca AS id,
        c.valor_divida AS valor,
        c.status_cobranca AS status,
        c.juros_cobranca AS juros,
        c.data_vencimento AS dataVencimento,
        c.data_criacao AS dataCriacao,
        e.id_empresa AS empresaId,
        e.nome_empresa AS empresa,
        u.id_usuario AS usuarioId,
        u.nome_usuario AS devedor
      FROM cobranca c
      JOIN empresa e ON c.empresa_id_empresa = e.id_empresa
      JOIN usuarios u ON c.usuario_id_usuario = u.id_usuario
      WHERE c.id_cobranca = ?
    `

    const [linhas] = await db.execute(query, [id])
    return linhas[0]
  },

  atualizarCobranca: async (id, valor, status, juros, dataVencimento, dataCriacao, empresaId, usuarioId) => {
    const query = `
      UPDATE cobranca
      SET
        valor_divida = ?,
        status_cobranca = ?,
        juros_cobranca = ?,
        data_vencimento = ?,
        data_criacao = ?,
        empresa_id_empresa = ?,
        usuario_id_usuario = ?
      WHERE id_cobranca = ?
    `

    const [resultado] = await db.execute(query, [
      valor,
      status,
      juros,
      dataVencimento,
      dataCriacao,
      empresaId,
      usuarioId,
      id
    ])

    return resultado.affectedRows
  },

  deletarCobranca: async (id) => {
    const query = `DELETE FROM cobranca WHERE id_cobranca = ?`
    const [resultado] = await db.execute(query, [id])
    return resultado.affectedRows
  }
}
