// importa a configuracao do banco
const db = require("../config/db.js")

module.exports = {
    buscarPorEmail: async (email) => {
        // Query
        const query = `
            SELECT
                id_usuario AS id,
                email_usuario AS email,
                senha_usuario AS senha,
                cargo AS perfil,
                SUBSTRING_INDEX(email_usuario, '@', 1) AS nome,
                NULL AS telefone,
                NULL AS foto
            FROM usuarios
            WHERE email_usuario = ?
        `

        // Guarda o resultado da consulta na variavel
        const [linhas] = await db.execute(query,[email])
        // Retorna pro controller o resultado, nessa caso o usuario encontrado
        return linhas[0]
    }
    ,
    // CRUD
    // CREATE
    criarUsuario: async (nome, email, senha, telefone, foto, perfil) =>{
        // Query pra fazer a consulta no banco
        const query = `INSERT INTO usuarios (email_usuario, senha_usuario, cargo)
        VALUES (?,?,?)`

        // Guarda o resultado da consulta na variavel
        const [resultado] = await db.execute(query, [email, senha, perfil])
        // Retorna pro controller o resultado, nesse caso o usuario encontrado
        return resultado.insertId

    },

    // READ
    listarUsuarios: async () => {
        // Query pra fazer a consulta no banco
        const query = `
            SELECT
                id_usuario AS id,
                SUBSTRING_INDEX(email_usuario, '@', 1) AS nome,
                email_usuario AS email,
                senha_usuario AS senha,
                cargo AS perfil,
                NULL AS telefone,
                NULL AS foto
            FROM usuarios
        `
        // Guarda o resultado da consulta na variavel
        const [linhas] = await db.execute(query)
        // Retorna pro controller o resultado, nesse caso o usuarios
        return linhas
    },

    listarDevedores: async () => {
        // Query pra fazer a consulta no banco
        const query = `
            SELECT
                id_usuario AS id,
                SUBSTRING_INDEX(email_usuario, '@', 1) AS nome,
                email_usuario AS email,
                senha_usuario AS senha,
                cargo AS perfil,
                NULL AS telefone,
                NULL AS foto
            FROM usuarios
            WHERE cargo = "devedor"
        `
        // Guarda o resultado da consulta na variavel
        const [linhas] = await db.execute(query)
        // Retorna pro controller o resultado, nesse caso o usuarios
        return linhas
    },

    //DELETE
    deletarUsuario: async (id) => {
        // Query pra fazer a consulta no banco
        const query = 'DELETE FROM usuarios WHERE id_usuario = ?'
        // Guarda o resultado da consulta na variavel
        const [resultado] = await db.execute(query, [id])
        // Retorna pro controller o resultado, nesse caso o usuarios
        return resultado.affectedRows
    },

    // UPDATE
    // Busca por id
    buscarPorId: async(id) => {
        // Query pra fazer a consulta no banco
        const query = `
            SELECT
                id_usuario AS id,
                SUBSTRING_INDEX(email_usuario, '@', 1) AS nome,
                email_usuario AS email,
                senha_usuario AS senha,
                cargo AS perfil,
                NULL AS telefone,
                NULL AS foto
            FROM usuarios
            WHERE id_usuario = ?
        `;
        // Guarda o resultado da consulta na variavel
        const [linhas] = await db.execute(query, [id]);
        // Retorna pro controller o resultado, nessa caso o usuario encontrado
        return linhas[0];
    },
                                                                                                                                                                      
    // Atualiza o usuario
    atualizarUsuario: async (id, nome, email, senhaHash , telefone, foto, perfil) => {
        // Lógica p/ atualizar com e sem foto anexada
        if (foto) {
            // Query pra fazer a consulta no banco
            const query = 'UPDATE usuarios SET email_usuario = ?, senha_usuario = ?, cargo = ? WHERE id_usuario = ?';
            const [resultado] = await db.execute(query, [email, senhaHash, perfil, id]);
            return resultado.affectedRows;
        } else {
            const query = `UPDATE usuarios SET email_usuario = ?, senha_usuario = ?, cargo = ? WHERE id_usuario = ?`;
            const [resultado] = await db.execute(query, [email, senhaHash, perfil, id]);
            return resultado.affectedRows;
        }
    }
}
