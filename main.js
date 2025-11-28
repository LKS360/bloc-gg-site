// main.js - Controla o visual do usuário logado

// Quando a página carregar, pergunta pro servidor: "Tem alguém logado?"
fetch('/user')
    .then(response => response.json())
    .then(data => {
        const loginButtons = document.querySelectorAll('.btn-login');

        // --- LÓGICA DA BARRA DE NAVEGAÇÃO ---
        loginButtons.forEach(btn => {
            if (data.logged) {
                // [CORREÇÃO] Se estiver logado, o botão leva para o PERFIL
                btn.href = 'perfil.html';
                
                // Monta o visual com a foto e o nome
                btn.innerHTML = `
                    <img src="${data.user.photos[2].value}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #fff; vertical-align: middle; margin-right: 8px;">
                    ${data.user.displayName}
                `;
                
                // Estilo VIP (Dourado)
                btn.style.borderColor = '#ffc107';
                btn.style.color = '#fff';
            } else {
                // Se não estiver logado, manda pra Steam
                btn.href = '/auth/steam';
                btn.innerHTML = '<i class="fa-brands fa-steam"></i> ENTRAR COM STEAM';
            }
        });

        // --- LÓGICA ESPECÍFICA DA PÁGINA DE PERFIL ---
        // Esse bloco só roda se o usuário estiver na página 'perfil.html'
        if (window.location.pathname.includes('perfil.html')) {
            if (!data.logged) {
                // Proteção: Se não estiver logado, chuta pra Home
                window.location.href = 'index.html';
            } else {
                // Preenche os dados reais da Steam na tela de perfil
                document.getElementById('user-avatar').src = data.user.photos[2].value;
                document.getElementById('user-name').innerText = data.user.displayName;
                document.getElementById('user-steamid').innerText = data.user.id;
                
                // Debug para você ver os dados no console (F12)
                console.log("Dados do Usuário:", data.user);
            }
        }
    })
    .catch(error => console.error('Erro ao verificar login:', error));