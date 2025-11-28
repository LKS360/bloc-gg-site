const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();

// --- CONFIGURAÇÃO ---
// Sua API Key da Steam
const STEAM_API_KEY = 'A7FCD68DE3AF9C0B12FF525BD5364F21'; 

// SEU LINK DO RAILWAY (Sem barra no final para facilitar)
// IMPORTANTE: Se o link do Railway mudar, altere apenas aqui!
const RAILWAY_URL = 'https://bloc-gg-site-production.up.railway.app';

// Configuração do Passport (o porteiro)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new SteamStrategy({
    // Correção: Usando a variável para montar o link perfeito (sem //)
    returnURL: `${RAILWAY_URL}/auth/steam/return`,
    realm: `${RAILWAY_URL}/`,
    apiKey: STEAM_API_KEY
  },
  function(identifier, profile, done) {
    // Aqui a Steam devolveu os dados do usuário!
    return done(null, profile);
  }
));

// Configuração da Sessão
app.use(session({
    secret: 'segredo_do_bloc_gg',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve os arquivos HTML/CSS da sua pasta atual
app.use(express.static(__dirname));

// --- ROTAS (Os caminhos do site) ---

// 1. Rota para iniciar o login
app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res) {
    // Redireciona para a Steam
  });

// 2. Rota de volta (Retorno da Steam)
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    // SUCESSO: Volta para a página inicial
    res.redirect('/');
  });

// 3. Rota para o Front-end pegar os dados
app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ 
            logged: true, 
            user: req.user 
        });
    } else {
        res.json({ logged: false });
    }
});

// 4. Rota de Logout
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Porta do Servidor (Railway ou Local)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});// ... (O início do arquivo continua igual) ...

// --- LISTA DE ADMINS ---
// Coloca aqui o teu SteamID64 (aquele número longo)
const ADMIN_IDS = [
    '76561198000000000', // <--- SUBSTITUI PELO TEU ID DA STEAM
    'OUTRO_ID_SE_QUISERES' 
];

// ... (Configurações do Passport continuam iguais) ...

// --- ROTAS ATUALIZADAS ---

// 1. Rota para iniciar o login
app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res) {
    // Redireciona para a Steam
  });

// 2. Rota de volta (Retorno da Steam)
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

// 3. Rota INTELIGENTE para o Front-end
app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        // Verifica se o ID do usuário está na lista de ADMINS
        const steamID = req.user.id; // O Passport salva o ID aqui
        const isUserAdmin = ADMIN_IDS.includes(steamID);

        res.json({ 
            logged: true, 
            user: req.user,
            isAdmin: isUserAdmin // Envia TRUE se for admin, FALSE se não for
        });
    } else {
        res.json({ logged: false, isAdmin: false });
    }
});

// ... (Resto do arquivo, logout e listen continuam iguais)