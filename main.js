// Executa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    fetch('/user')
        .then(response => response.json())
        .then(data => {
            const btnLogin = document.querySelector('.btn-login');
            const navMenu = document.querySelector('.menu');

            if (data.logged) {
                // 1. Atualiza o botão de Login com a foto e nome
                btnLogin.innerHTML = `<img src="${data.user.photos[0].value}" style="width:20px; border-radius:50%; margin-right:5px; vertical-align:middle;"> ${data.user.displayName}`;
                btnLogin.href = "/logout";
                btnLogin.style.backgroundColor = "#2a2b33"; // Cor de "logado"

                // 2. Se for ADMIN, cria o botão do Painel
                if (data.isAdmin) {
                    // Verifica se o botão já existe para não duplicar
                    if (!document.querySelector('.btn-admin')) {
                        const adminBtn = document.createElement('a');
                        adminBtn.href = "admin.html";
                        adminBtn.className = "btn-admin";
                        adminBtn.innerHTML = '<i class="fa-solid fa-user-shield"></i> Admin';
                        
                        // Insere antes do botão de logout
                        navMenu.insertBefore(adminBtn, btnLogin);
                    }
                }
            } else {
                // Se não estiver logado
                btnLogin.innerHTML = '<i class="fa-brands fa-steam"></i> LOGIN STEAM';
                btnLogin.href = "/auth/steam";
            }
        })
        .catch(error => {
            console.error('Erro ao verificar login:', error);
            const btnLogin = document.querySelector('.btn-login');
            if(btnLogin) btnLogin.textContent = "LOGIN";
        });
});