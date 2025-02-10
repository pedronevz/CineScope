document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        // Se não houver usuário logado, redireciona para a tela de login
        window.location.href = 'login.html';
        return;
    }

    // Manipulador de envio do formulário de pesquisa
    document.getElementById('search-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const searchQuery = document.getElementById('search').value;

        try {
            const response = await fetch(`http://localhost:3000/filmes?nome=${encodeURIComponent(searchQuery)}`);

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(`Erro ao buscar filmes: ${erro.erro}`);
            }

            const filmes = await response.json();
            const filmeSelect = document.getElementById('filme');

            // Limpa as opções anteriores
            filmeSelect.innerHTML = '';

            filmes.forEach(filme => {
                const option = document.createElement('option');
                option.value = filme.id;
                option.textContent = filme.nome;
                filmeSelect.appendChild(option);
            });

            document.getElementById('review-form').style.display = 'block';
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao buscar filmes. Tente novamente.");
        }
    });

    document.getElementById("review-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        const idfilme = document.getElementById("filme").value;
        const rating = document.getElementById("rating").value;
        const reviewText = document.getElementById("review-text").value;

        if (rating === "" || reviewText.trim() === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/filme/${idfilme}/usuario/${usuarioLogado.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nota: rating, texto: reviewText })
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(`Erro ao enviar review: ${erro.erro}`);
            }

            alert("Review submetida com sucesso!");
            window.location.href = `movie_details.html?id=${idfilme}`;
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao submeter review. Tente novamente.");
        }
    });
});
