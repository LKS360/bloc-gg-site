const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();

// --- CONFIGURAÇÃO ---
// COLOCAR SUA API KEY AQUI:
const STEAM_API_KEY = 'A7FCD68DE3AF9C0B12FF525BD5364F21'; 

// Configuração do Passport (o porteiro)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new SteamStrategy({
    // CUIDADO: Mantenha o final /auth/steam/return
    returnURL: 'https://bloc-gg-site-production.up.railway.app//auth/steam/return',
    
    // Aqui é só o link base com a barra no final
    realm: 'https://bloc-gg-site-production.up.railway.app/',
    
    apiKey: A7FCD68DE3AF9C0B12FF525BD5364F21
  },
));

// Configuração da Sessão (Memória do servidor)
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

// 1. Rota para iniciar o login (Quando clicar no botão)
app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res) {
    // A função não faz nada, pois o request é redirecionado para a Steam
  });

// 2. Rota de volta (Quando a Steam devolve o usuário)
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    // Login com sucesso! Vai para a dashboard ou home
    res.redirect('/');
  });

// 3. Rota para o Front-end saber quem está logado
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

// O Railway vai te dar uma porta (process.env.PORT). Se não der, usa a 3000.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});