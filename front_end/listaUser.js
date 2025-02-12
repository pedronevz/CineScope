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
        const response = await fetch(`http://localhost:3000/listas/usuario/${userId}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar listas: ${response.statusText}`);
        }
        const listas = await response.json();
        console.log(listas)
        
        
        // Exibe as listas
        listas.forEach(lista => {
            const listItem = document.createElement("div");
            listItem.classList.add("list-item");
            listItem.innerHTML = `
                <h3>${lista.nome}</h3>
                <ul>
                    ${lista.filmes.map(filme => `<li>${filme.titulo}</li>`).join('')}
                </ul>
                <button class="btn btn-edit" data-id="${lista.id}">Editar</button>
                <button class="btn btn-delete" data-id="${lista.id}">Excluir</button>
            `;
            listsContainer.appendChild(listItem);
        });

        // Adiciona eventos aos botões de editar e excluir
        listsContainer.addEventListener("click", async function (event) {
            if (event.target.classList.contains("btn-delete")) {
                const listaId = event.target.getAttribute("data-id");
                await excluirLista(listaId);
                location.reload(); // Recarrega a página após excluir
            } else if (event.target.classList.contains("btn-edit")) {
                const listaId = event.target.getAttribute("data-id");
                window.location.href = `editarLista.html?id=${listaId}`;
            }
        });
    } catch (error) {
        console.error("Erro ao buscar listas:", error);
        alert("Erro ao carregar listas");
    }
});

async function excluirLista(listaId) {
    try {
        const response = await fetch(`http://localhost:3000/listas/${listaId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Erro ao excluir lista");
        }
        alert("Lista excluída com sucesso!");
    } catch (error) {
        console.error("Erro ao excluir lista:", error);
        alert("Erro ao excluir lista");
    }
}