// Função para enviar a review atualizada para o backend
async function atualizarReview(idReview, dadosAtualizados) {
    try {
        const response = await fetch(`http://localhost:3000/reviews/${idReview}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizados),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar a review');
        }

        const data = await response.json();
        console.log('Review atualizada com sucesso:', data);
        alert('Review atualizada com sucesso!');
        closeModal();
        location.reload();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar a review. Tente novamente.');
    }
}

// Função para lidar com o envio do formulário
function handleFormSubmit(event) {
    event.preventDefault();

    const idReview = document.getElementById('reviewId').value;
    const reviewText = document.getElementById('reviewText').value;

    const dadosAtualizados = {
        texto: reviewText,
    };

    atualizarReview(idReview, dadosAtualizados);
}

// Adiciona o evento de submit ao formulário do modal
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.modal-form');
    form.addEventListener('submit', handleFormSubmit);
});

// Função para abrir o modal com os dados da review
function openModal(idReview, movieTitle, reviewText) {
    document.getElementById('reviewId').value = idReview;
    document.getElementById('movieTitle').value = movieTitle;
    document.getElementById('reviewText').value = reviewText;
    document.getElementById('editModal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Fechar o modal se o usuário clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};