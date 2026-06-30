const db = require("../config/db.js")

const camposUsuario = `
    id_usuario AS id,
    COALESCE(nome_usuario, SUBSTRING_INDEX(email_usuario, '@', 1)) AS nome,
    email_usuario AS email,
    senha_usuario AS senha,
    cargo AS perfil,
    telefone_usuario AS telefone,
    foto_usuario AS foto
`

module.exports = {
    buscarPorEmail: async (email) => {
        const query = `
            SELECT ${camposUsuario}
            FROM usuarios
            WHERE email_usuario = ?
        `

        const [linhas] = await db.execute(query, [email])
        return linhas[0]
    },

    criarUsuario: async (nome, email, senha, telefone, foto, perfil) => {
        const query = `
            INSERT INTO usuarios (
                nome_usuario,
                email_usuario,
                senha_usuario,
                telefone_usuario,
                foto_usuario,
                cargo
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `

        const [resultado] = await db.execute(query, [nome, email, senha, telefone, foto, perfil])
        return resultado.insertId
    },

    listarUsuarios: async () => {
        const query = `
            SELECT ${camposUsuario}
            FROM usuarios
            ORDER BY id_usuario
        `

        const [linhas] = await db.execute(query)
        return linhas
    },

    listarDevedores: async () => {
        const query = `
            SELECT ${camposUsuario}
            FROM usuarios
            WHERE cargo = 'devedor'
            ORDER BY id_usuario
        `

        const [linhas] = await db.execute(query)
        return linhas
    },

    deletarUsuario: async (id) => {
        const query = "DELETE FROM usuarios WHERE id_usuario = ?"
        const [resultado] = await db.execute(query, [id])
        return resultado.affectedRows
    },

    buscarPorId: async (id) => {
        const query = `
            SELECT ${camposUsuario}
            FROM usuarios
            WHERE id_usuario = ?
        `

        const [linhas] = await db.execute(query, [id])
        return linhas[0]
    },

    atualizarUsuario: async (id, nome, email, senhaHash, telefone, foto, perfil) => {
        const query = `
            UPDATE usuarios
            SET
                nome_usuario = ?,
                email_usuario = ?,
                senha_usuario = ?,
                telefone_usuario = ?,
                foto_usuario = ?,
                cargo = ?
            WHERE id_usuario = ?
        `

        const [resultado] = await db.execute(query, [nome, email, senhaHash, telefone, foto, perfil, id])
        return resultado.affectedRows
    }
}
