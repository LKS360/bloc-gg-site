// main.js - Controla o visual do usuário logado

// Quando a página carregar, pergunta pro servidor: "Tem alguém logado?"
fetch('/user')
    .then(response => response.json())
    .then(data => {
        const loginButton = document.querySelector('.btn-login');

        if (data.logged) {
            // --- USUÁRIO LOGADO ---
            console.log("Usuário logado:", data.user.displayName);
            // Mostra o ID da Steam no console (útil para admins!)
console.log("SteamID64:", data.user.id);

            // 1. Muda o link para fazer Logout em vez de Login
            loginButton.href = '/logout';
            
            // 2. Muda o visual do botão (Mostra foto e nome)
            // A Steam manda várias fotos, a [2] geralmente é a média/grande
            const avatarUrl = data.user.photos[2].value;
            const nick = data.user.displayName;

            loginButton.innerHTML = `
                <img src="${avatarUrl}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #fff; vertical-align: middle; margin-right: 8px;">
                ${nick} <i class="fa-solid fa-sign-out-alt" style="margin-left: 5px; font-size: 12px; opacity: 0.5;"></i>
            `;
            
            // Muda a cor do botão para verde (opcional, pra indicar sucesso)
            loginButton.style.borderColor = '#4caf50';
            loginButton.style.color = '#fff';

        } else {
            // --- USUÁRIO DESLOGADO ---
            console.log("Ninguém logado.");
            
            // Garante que o botão leve para o Login da Steam
            loginButton.href = '/auth/steam';
            loginButton.innerHTML = '<i class="fa-brands fa-steam"></i> ENTRAR COM STEAM';
        }
    })
    .catch(error => console.error('Erro ao verificar login:', error));