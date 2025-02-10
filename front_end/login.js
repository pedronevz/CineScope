document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coletar os dados do formulário
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    const userData = { nome, senha };

    console.log('Tentativa de login com:', userData);

    try {
        const response = await fetch('http://localhost:3000/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao fazer login');
        }

        // Armazena os dados do usuário logado (pode incluir token futuramente)
        localStorage.setItem('usuarioLogado', JSON.stringify(data));

        alert(`Bem-vindo, ${data.nome}!`);
        window.location.href = 'usuario.html'; // Redireciona para a página inicial

    } catch (error) {
        console.error('Erro no login:', error);
        alert(error.message);
    }
});
