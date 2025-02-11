document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        window.location.href = "login.html";
        return;
    }

    // Função para carregar as reviews do usuário
    async function carregarReviews() {
        try {
            const response = await fetch(`http://localhost:3000/reviews/usuario/${usuarioLogado.id}`);
            const reviews = await response.json();

            const reviewsContainer = document.getElementById("reviews-list");
            reviewsContainer.innerHTML = ""; // Limpa o conteúdo atual

            reviews.forEach(review => {
                const reviewItem = document.createElement("div");
                reviewItem.classList.add("list-item");

                const reviewTitulo = document.createElement("h3");
                reviewTitulo.textContent = review.tituloFilme;

                const reviewTexto = document.createElement("p");
                reviewTexto.textContent = `"${review.texto}" Nota ${review.nota}/10`;

                const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.classList.add("btn", "btn-edit");
                btnEditar.addEventListener("click", () => abrirModalEdicao(review));

                const btnExcluir = document.createElement("button");
                btnExcluir.textContent = "Excluir";
                btnExcluir.classList.add("btn", "btn-delete");
                btnExcluir.addEventListener("click", () => excluirReview(review.id));

                reviewItem.appendChild(reviewTitulo);
                reviewItem.appendChild(reviewTexto);
                reviewItem.appendChild(btnEditar);
                reviewItem.appendChild(btnExcluir);

                reviewsContainer.appendChild(reviewItem);
            });
        } catch (error) {
            console.error("Erro ao carregar reviews:", error);
        }
    }

    // Função para abrir o modal de edição
    function abrirModalEdicao(review) {
        document.getElementById("reviewText").value = review.texto;
        document.getElementById("reviewNota").value = review.nota;
        document.getElementById("editModal").style.display = "block";

        // Armazenar o ID da review no formulário para uso posterior
        document.getElementById("editReviewForm").dataset.reviewId = review.id;
    }

    // Função para fechar o modal
    function closeModal() {
        document.getElementById("editModal").style.display = "none";
    }

    // Função para enviar os dados atualizados ao backend
    document.getElementById("editReviewForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const reviewId = document.getElementById("editReviewForm").dataset.reviewId;
        const reviewText = document.getElementById("reviewText").value;
        const reviewNota = document.getElementById("reviewNota").value;

        try {
            const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    texto: reviewText,
                    nota: parseFloat(reviewNota),
                }),
            });

            if (response.ok) {
                closeModal();
                carregarReviews(); // Recarrega as reviews após a edição
            } else {
                console.error("Erro ao atualizar a review:", await response.text());
            }
        } catch (error) {
            console.error("Erro ao atualizar a review:", error);
        }
    });

    // Função para excluir uma review
    async function excluirReview(reviewId) {
        if (confirm("Tem certeza que deseja excluir esta review?")) {
            try {
                const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    carregarReviews(); // Recarrega as reviews após a exclusão
                } else {
                    console.error("Erro ao excluir a review:", await response.text());
                }
            } catch (error) {
                console.error("Erro ao excluir a review:", error);
            }
        }
    }

    // Carregar as reviews ao carregar a página
    carregarReviews();
});