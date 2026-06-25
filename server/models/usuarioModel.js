// importa a configuracao do banco
const db = require("../config/db.js")

module.exports = {
    buscarPorEmail: async (email) => {
        // Query
        const query = 'select * from usuarios where email = ?'

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
        const query = `INSERT INTO usuarios (nome, email, senha, telefone, foto, perfil)
        VALUES (?,?,?,?,?,?)`

        // Guarda o resultado da consulta na variavel
        const [resultado] = await db.execute(query, [nome , email, senha, telefone, foto, perfil])
        // Retorna pro controller o resultado, nesse caso o usuario encontrado
        return resultado.insertId

    },

    // READ
    listarUsuarios: async () => {
        // Query pra fazer a consulta no banco
        const query = 'SELECT * FROM usuarios'
        // Guarda o resultado da consulta na variavel
        const [linhas] = await db.execute(query)
        // Retorna pro controller o resultado, nesse caso o usuarios
        return linhas
    },

    //DELETE
    deletarUsuario: async (id) => {
        // Query pra fazer a consulta no banco
        const query = 'DELETE FROM usuarios WHERE id = ?'
        // Guarda o resultado da consulta na variavel
        const [resultado] = await db.execute(query, [id])
        // Retorna pro controller o resultado, nesse caso o usuarios
        return resultado.affectedRows
    },

    // UPDATE
    // Busca por id
    buscarPorId: async(id) => {
        // Query pra fazer a consulta no banco
        const query = 'SELECT * FROM usuarios WHERE id = ?';
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
            const query = 'UPDATE usuarios SET nome = ?, email = ?, senha = ?, telefone = ?, foto = ?, perfil = ? WHERE id = ?';
            const [resultado] = await db.execute(query, [nome, email, senhaHash, telefone, foto, perfil, id]);
            return resultado.affectedRows;
        } else {
            const query = `UPDATE usuarios SET nome = ?, email = ?, senha = ?, telefone = ?, perfil = ? WHERE id = ?`;
            const [resultado] = await db.execute(query, [nome, email, senhaHash, telefone, perfil, id]);
            return resultado.affectedRows;
        }
    }
}