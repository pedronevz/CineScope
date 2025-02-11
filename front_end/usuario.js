document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    document.getElementById("logout-btn").addEventListener("click", () => {
        if (confirm("Tem certeza que deseja sair?")) {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "login.html";
        }
    });

    if (!usuarioLogado) {
        // Se não houver usuário logado, redireciona para a tela de login
        window.location.href = "login.html";
        return;
    }

    // Atualiza o nome do usuário
    document.querySelector(".username").textContent = usuarioLogado.nome;

    // Atualiza a bio (se existir)
    if (usuarioLogado.bio) {
        document.querySelector(".bio").textContent = usuarioLogado.bio;
    }

    // Atualiza a foto do perfil (se existir)
    if (usuarioLogado.fotoPerfil) {
        document.querySelector(".profile-pic").src = usuarioLogado.fotoPerfil;
    }

    // Função para carregar as reviews do usuário
    async function carregarReviews() {
        try {
            const response = await fetch(`http://localhost:3000/reviews/usuario/${usuarioLogado.id}`);
            const reviews = await response.json();

            // Limita as reviews a 3
            const reviewsLimitadas = reviews.slice(0, 3);

            // Seleciona o container das reviews
            const reviewsContainer = document.querySelector(".section:first-child");

            // Limpa o conteúdo atual das reviews
            reviewsContainer.querySelectorAll(".list-item").forEach(item => item.remove());

            // Adiciona as novas reviews ao container
            reviewsLimitadas.forEach(review => {
                const reviewItem = document.createElement("div");
                reviewItem.classList.add("list-item");

                const reviewTitulo = document.createElement("h3");

                const reviewTexto = document.createElement("p");
                reviewTexto.textContent = `"${review.textoReview}" Nota ${review.nota}/10`;

                reviewItem.appendChild(reviewTitulo);
                reviewItem.appendChild(reviewTexto);

                reviewsContainer.insertBefore(reviewItem, reviewsContainer.querySelector(".btn-ver-mais"));
            });
        } catch (error) {
            console.error("Erro ao carregar reviews:", error);
        }
    }

    // Chama a função para carregar as reviews
    carregarReviews();
});