document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const atorId = params.get("id");

    console.log("ID do ator:", atorId);
    if (!atorId) {
        alert("ID do ator não encontrado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/atores/${atorId}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar os detalhes do ator.");
        }

        const ator = await response.json();
        console.log("Dados do ator:", ator);

        // Converte a data para um formato legível (dd/mm/aaaa)
        const dataFormatada = new Date(ator.data_nasc).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Atualiza os elementos da página com os dados do ator
        document.getElementById("actor-name").innerText = ator.nome;
        document.getElementById("data-nasc").innerText = dataFormatada;

        // Atualiza a lista de filmes
        const moviesList = document.getElementById("movies-list");
        moviesList.innerHTML = ""; // Limpa a lista antes de adicionar os filmes

        if (Array.isArray(ator.filmes) && ator.filmes.length > 0) {
            ator.filmes.forEach(filme => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="filme.html?id=${filme.id}">${filme.titulo}</a>`;
                moviesList.appendChild(li);
            });
        } else {
            moviesList.innerHTML = "<li>Nenhum filme encontrado.</li>";
        }

    } catch (error) {
        console.error("Erro ao carregar os dados do ator:", error);
        alert("Erro ao carregar os dados do ator.");
    }
});
