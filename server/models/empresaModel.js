const db = require("../config/db.js")

module.exports = {
  listarEmpresas: async () => {
    const query = `
      SELECT
        id_empresa AS id,
        nome_empresa AS nome,
        email_empresa AS email,
        CNPJ_empresa AS cnpj,
        telefoneComercial_empresa AS telefone,
        bairro_empresa AS bairro,
        cidade_empresa AS cidade,
        estado_empresa AS estado
      FROM empresa
      ORDER BY nome_empresa
    `

    const [linhas] = await db.execute(query)
    return linhas
  }
}
