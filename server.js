require('dotenv').config(); // Carrega o arquivo .env

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();

// --- CONFIGURAÇÃO ---
// Chave da Steam (Lê do .env ou usa a fixa se falhar)
const STEAM_API_KEY = process.env.STEAM_API_KEY || 'A7FCD68DE3AF9C0B12FF525BD5364F21';

// A CORREÇÃO MÁGICA:
// Se houver RAILWAY_URL no .env, usa-o (Online).
// Se não, usa localhost (PC).
const BASE_URL = process.env.RAILWAY_URL || 'http://localhost:3000';

// Lista de Admins
const ADMIN_IDS = [
    process.env.OWNER_ID,    
    '76561198159755499', // O teu ID
    '76561198000000000'  // Outro admin (exemplo)
];// Configuração da Sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo_bloc_gg',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Guardar utilizador
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Configuração da Estratégia Steam
passport.use(new SteamStrategy({
    returnURL: `${BASE_URL}/auth/steam/return`,
    realm: `${BASE_URL}/`,
    apiKey: STEAM_API_KEY
  },
  function(identifier, profile, done) {
    return done(null, profile);
  }
));

// Servir os ficheiros do site (HTML, CSS)
app.use(express.static(__dirname));
// --- ROTAS ---

// 1. Iniciar Login
app.get('/auth/steam', passport.authenticate('steam'), (req, res) => {});

// 2. Retorno da Steam
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // Sucesso! Vai para a home
  }
);

// 3. API User (Verifica Admin)
app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        const steamID = req.user._json.steamid;
        res.json({ 
            logged: true, 
            user: req.user,
            isAdmin: ADMIN_IDS.includes(steamID)
        });
    } else {
        res.json({ logged: false, isAdmin: false });
    }
});

// 4. Logout
app.get('/logout', (req, res) => {
    req.logout(() => { res.redirect('/'); });
});

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ BLOC.GG a rodar em: ${BASE_URL}`);
});