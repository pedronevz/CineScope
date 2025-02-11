document.getElementById('review-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o recarregamento da página

    // Recupera as IDs do filme e do usuário
    const idfilme = localStorage.getItem("filmeSelecionado");
    const idusuario = localStorage.getItem('sessaoId');

    // Coleta os dados do formulário
    const rating = document.getElementById('nota').value;
    const reviewText = document.getElementById('review').value;

    // Monta o objeto com os dados da review
    const reviewData = {
        nota: rating,
        texto: reviewText
    };

    try {
        // Envia a review para o servidor
        const response = await fetch(`http://localhost:3000/reviews/filme/${idfilme}/usuario/${idusuario}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });

        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Resposta de erro:', errorResponse);
            throw new Error('Erro ao enviar review');
        }

        // Exibe mensagem de sucesso
        const result = await response.json();
        localStorage.setItem('reviewId', result.id); // Guarda o ID da review
        alert('Review enviada com sucesso!');
        
        // Limpa o formulário
        document.getElementById('review-form').reset();

        // Redireciona para outra página (opcional)
        window.location.href = 'filme.html?id=' + idfilme; // Volta para a página do filme
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar review. Tente novamente.');
    }
});