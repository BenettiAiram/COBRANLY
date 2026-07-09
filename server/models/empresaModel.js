const db = require("../config/db.js")

module.exports = {
  listarEmpresas: async () => {
    const query = `
      SELECT
        e.id_empresa AS id,
        e.nome_empresa AS nome,
        e.email_empresa AS email,
        e.CNPJ_empresa AS cnpj,
        e.telefoneComercial_empresa AS telefone,
        e.bairro_empresa AS bairro,
        e.cidade_empresa AS cidade,
        e.estado_empresa AS estado,
        u.nome_usuario AS responsavel
      FROM empresa e
      LEFT JOIN usuarios u ON u.id_usuario = e.encarregado_empresa
      ORDER BY e.nome_empresa
    `

    const [linhas] = await db.execute(query)
    return linhas
  },

  listarResponsaveis: async () => {
    const query = `
      SELECT id_usuario AS id, nome_usuario AS nome
      FROM usuarios
      WHERE cargo IN ('administrador', 'cobrador')
      ORDER BY nome_usuario
    `

    const [linhas] = await db.execute(query)
    return linhas
  },

  criarEmpresa: async (nome, email, encarregadoId, cnpj, telefone, bairro, cidade, estado) => {
    const query = `
      INSERT INTO empresa (
        nome_empresa,
        email_empresa,
        encarregado_empresa,
        CNPJ_empresa,
        telefoneComercial_empresa,
        bairro_empresa,
        cidade_empresa,
        estado_empresa
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [resultado] = await db.execute(query, [nome, email, encarregadoId, cnpj, telefone, bairro, cidade, estado])
    return resultado.insertId
  }
}
