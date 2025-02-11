document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const diretorId = params.get("id");

    console.log("ID do diretor:", diretorId);
    if (!diretorId) {
        alert("ID do diretor não encontrado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/diretores/${diretorId}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar os detalhes do diretor.");
        }

        const diretor = await response.json();
        console.log("Dados do diretor:", diretor);

        // Converte a data para um formato legível (dd/mm/aaaa)
        const dataFormatada = new Date(diretor.data_nasc).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Atualiza os elementos da página com os dados do diretor
        document.getElementById("director-name").innerText = diretor.nome;
        document.getElementById("data-nasc").innerText = dataFormatada;

        // Atualiza a lista de filmes
        const moviesList = document.getElementById("movies-list");
        moviesList.innerHTML = ""; // Limpa a lista antes de adicionar os filmes

        if (Array.isArray(diretor.filmes) && diretor.filmes.length > 0) {
            diretor.filmes.forEach(filme => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="filme.html?id=${filme.id}">${filme.titulo}</a>`;
                moviesList.appendChild(li);
            });
        } else {
            moviesList.innerHTML = "<li>Nenhum filme encontrado.</li>";
        }

    } catch (error) {
        console.error("Erro ao carregar os dados do diretor:", error);
        alert("Erro ao carregar os dados do diretor.");
    }
});
