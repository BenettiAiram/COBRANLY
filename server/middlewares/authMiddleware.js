const jwt = require('jsonwebtoken');

// Verifica se existe algum token
function verificarAutanticacao(req, res, next) {
    // Verifica se tem algum token salvo
    const token = req.cookies?.token;

    // Se não tiver, já redireciona o usuário p/ tela de login
    if (!token) {
        return res.redirect('/login');
    }

    try {
        // Verifica se  token é válido ou não
        const dados = jwt.verify(token, process.env.JWT_SECRET);

        // Salva o usuário no backend, p/ todos terem acesso
        req.usuario = dados;
        // Variável global p/ EJS ter aceso às informações do usuário logado
        res.locals.usuario = dados;
        // Deixa o usuário prossegruir
        next();
    }
    catch (error) {
        res.clearCookie('token'); // apaga o token inválido
        return res.redirect('/login'); // vai p/ login

    }
}

//Filtros po perfil
// Apenas adms
function somenteAdmin(req, res, next) {
    if (req.usuario.role !== 'administrador') {
        return res.status(403).render('erro'),
            { mensagem: "Acesso negado: Somente administradores" }
    }
    next();
}
// Apenas ofertantes
function somenteOfertante(req, res, next) {
    if (req.usuario.perfil !== 'administrador' && req.usuario.perfil !== 'ofertante') {
        return res.status(403).render('erro'),
            { mensagem: "Acesso negado: Somente administradores e ofertntes" }
    }
    next();
}
// Apenas interessados
function somenteInteressado(req, res, next) {
    if (req.usuario.perfil !== 'interessado') {
        return res.status(403).render('erro'),
            { mensagem: "Acesso negado: Somente interessados" }
    }
    next();
}
// Área p/ interessados e ofertantes
function usuariosComuns(req, res, next) {
    if (req.usuario.perfil !== 'interessado' && req.usuario.perfil !== 'ofertante') {
        return res.status(403).render('erro'),
            { mensagem: "Acesso negado" }
    }
    next();
}
module.exports = { verificarAutanticacao, somenteAdmin, somenteInteressado, somenteOfertante, usuariosComuns}