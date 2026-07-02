const db = require("../config/db.js")

module.exports = {
  criarCobranca: async (valor, status, juros, dataVencimento, dataCriacao, empresaId, usuarioId) => {
    const query = `
      INSERT INTO cobranca (
        valor_divida,
        status_cobranca,
        juros_cobranca,
        data_vencimento,
        data_criacao,
        empresa_id_empresa,
        usuario_id_usuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    const [resultado] = await db.execute(query, [
      valor,
      status,
      juros,
      dataVencimento,
      dataCriacao,
      empresaId,
      usuarioId
    ])

    return resultado.insertId
  }
}
