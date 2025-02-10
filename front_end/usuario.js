document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        }
    });
    

    if (!usuarioLogado) {
        // Se não houver usuário logado, redireciona para a tela de login
        window.location.href = 'login.html';
        return;
    }

    // Atualiza o nome do usuário
    document.querySelector('.username').textContent = usuarioLogado.nome;
    
    // Atualiza a bio (se existir)
    if (usuarioLogado.bio) {
        document.querySelector('.bio').textContent = usuarioLogado.bio;
    }

    // Atualiza a foto do perfil (se existir)
    if (usuarioLogado.fotoPerfil) {
        document.querySelector('.profile-pic').src = usuarioLogado.fotoPerfil;
    }
});
