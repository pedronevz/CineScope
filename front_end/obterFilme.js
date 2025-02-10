document.addEventListener("DOMContentLoaded", async function () {
    const grid = document.querySelector(".grid");

    try {
        // Faz a requisição para obter os filmes do backend
        const response = await fetch("http://localhost:3000/filmes");
        const filmes = await response.json();

        if (!response.ok) {
            throw new Error(filmes.erro || "Erro ao carregar os filmes");
        }

        // Limpa qualquer conteúdo estático da grid
        grid.innerHTML = "";

        // Itera sobre os filmes e cria os elementos dinamicamente
        filmes.forEach(filme => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h3>${filme.titulo}</h3>
                <p>Ano: ${filme.ano}</p>
                <p>Gênero: ${filme.genero || "Desconhecido"}</p>
                <a href="filme.html?id=${filme.id}" class="button">Ver Mais</a>
            `;

            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        grid.innerHTML = `<p style="color: red;">Erro ao carregar os filmes.</p>`;
    }
});