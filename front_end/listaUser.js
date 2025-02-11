document.addEventListener("DOMContentLoaded", async function () {
    const userId = localStorage.getItem("sessaoId"); // Recupera o ID do usuário logado
    const listsContainer = document.getElementById("listsContainer"); // Elemento onde as listas serão exibidas

    if (!userId) {
        console.error("ID do usuário não encontrado no localStorage.");
        alert("Usuário não autenticado. Faça login novamente.");
        return;
    }

    try {
        // Requisição para obter as listas do usuário
        const response = await fetch(`http://localhost:3000/listas/${userId}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar listas: ${response.statusText}`);
        }
        const listas = await response.json();

        // Exibe as listas
        listas.forEach(lista => {
            const listItem = document.createElement("div");
            listItem.classList.add("list-item");
            listItem.innerHTML = `
                <h3>${lista.nome}</h3>
                <ul>
                    ${lista.filmes.map(filme => `<li>${filme.titulo}</li>`).join('')}
                </ul>
            `;
            listsContainer.appendChild(listItem);
        });
    } catch (error) {
        console.error("Erro ao buscar listas:", error);
        alert("Erro ao carregar listas");
    }
});