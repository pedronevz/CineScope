document.getElementById('cadastroForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coletar os dados do formulário usando IDs
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const data = document.getElementById('data').value;
    const bio = document.getElementById('bio').value;

    // Criar o objeto de dados para enviar ao servidor
    const userData = {
        nome: nome,
        email: email,
        senha: senha,
        data: data,
        bio: bio
    };

    console.log('Dados enviados:', userData); // Log dos dados enviados

    try {
        // Enviar os dados para o servidor usando fetch
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorResponse = await response.json(); // Captura a resposta de erro
            console.error('Resposta de erro:', errorResponse); // Log da resposta de erro
            throw new Error('Erro ao cadastrar usuário');
        }

        const data = await response.json();
        alert('Usuário cadastrado com sucesso!');
        console.log('Usuário cadastrado:', data);

        // Armazenar dados do usuário no localStorage
        localStorage.setItem('usuarioLogado', JSON.stringify({
            id: data.id, // Supondo que o servidor retorne o ID do usuário
            nome: data.nome, // Supondo que o servidor retorne o nome do usuário
            email: data.email // Supondo que o servidor retorne o email do usuário
        }));

        console.log('Dados do usuário armazenados:', localStorage.getItem('usuarioLogado'));

        // Redirecionar para a página de login ou outra página
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar usuário. Tente novamente.');
    }
});