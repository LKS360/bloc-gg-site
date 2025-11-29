require('dotenv').config(); // <--- OBRIGATÓRIO: Carrega o cofre .env

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();

// --- CONFIGURAÇÃO DE SEGURANÇA ---
// Agora o código busca as variáveis dentro do arquivo .env
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const RAILWAY_URL = process.env.RAILWAY_URL || 'http://localhost:3000';

// Lista de Admins (Pega do .env ou adiciona manualmente aqui)
const ADMIN_IDS = [
    process.env.OWNER_ID, 
    '76561198000000001' // Pode adicionar mais IDs aqui separando por vírgula
];

// Configuração da Sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo_padrao_dev',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Configuração do Passport (Steam)
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: `${RAILWAY_URL}/auth/steam/return`,
    realm: `${RAILWAY_URL}/`,
    apiKey: STEAM_API_KEY
  },
  function(identifier, profile, done) {
    return done(null, profile);
  }
));

// Servir os arquivos HTML/CSS/JS da pasta atual
app.use(express.static(__dirname));

// --- ROTAS DO SITE ---

// 1. Rota de Login (Manda pra Steam)
app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res) {
    // A função não faz nada, pois o redirect acontece antes
  });

// 2. Rota de Retorno (Volta da Steam)
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

// 3. Rota API: Diz ao Front-end quem está logado e se é Admin
app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        // Verifica se o ID do usuário está na lista de ADMINS
        const steamID = req.user._json.steamid; 
        const isUserAdmin = ADMIN_IDS.includes(steamID);

        res.json({ 
            logged: true, 
            user: req.user,
            isAdmin: isUserAdmin // Envia TRUE se for admin
        });
    } else {
        res.json({ logged: false, isAdmin: false });
    }
});

// 4. Rota de Logout
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Inicia o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ BLOC.GG rodando na porta ${PORT}`);
    console.log(`🔗 Link: ${RAILWAY_URL}`);
});