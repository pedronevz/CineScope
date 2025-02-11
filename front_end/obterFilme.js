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

            // Criação do HTML do card do filme
            card.innerHTML = `
                <h3>${filme.titulo}</h3>
                <p>Ano: ${filme.ano}</p>
                <button class="button ver-mais" data-id="${filme.id}">Ver Mais</button>
            `;

            grid.appendChild(card);
        });

        // Adiciona evento de clique para os botões "Ver Mais"
        document.querySelectorAll(".ver-mais").forEach(button => {
            button.addEventListener("click", function () {
                const filmeId = this.getAttribute("data-id");
                localStorage.setItem("filmeSelecionado", filmeId);
                window.location.href = `filme.html?id=${filmeId}`;
            });
        });

    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        grid.innerHTML = `<p style="color: red;">Erro ao carregar os filmes.</p>`;
    }
});
