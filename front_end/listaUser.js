document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM carregado, iniciando script...");
    
    const userId = localStorage.getItem("sessaoId"); // Recupera o ID do usuário logado
    const listsContainer = document.getElementById("listsContainer"); // Elemento onde as listas serão exibidas

    if (!userId) {
        console.error("ID do usuário não encontrado no localStorage.");
        alert("Usuário não autenticado. Faça login novamente.");
        return;
    }
    
    try {
        // Adiciona um timestamp à URL para evitar cache do navegador
        const url = `http://localhost:3000/listas/usuario/${userId}?_=${new Date().getTime()}`;
        
        // Requisição para obter as listas do usuário
        const response = await fetch(url, { cache: "no-store" });

        // Se a resposta for um erro 404 ou outro, captura a falha antes de chamar .json()
        if (!response.ok) {
            if (response.status === 404) {
                console.warn("Nenhuma lista encontrada para este usuário (erro 404).");
                listsContainer.innerHTML = "<p>Nenhuma lista encontrada. Crie uma nova!</p>";
                return;
            }
            throw new Error(`Erro ao carregar listas: ${response.statusText}`);
        }

        // Se a resposta estiver vazia, assume que não há listas
        const textData = await response.text();
        if (!textData) {
            console.warn("Resposta vazia do servidor.");
            listsContainer.innerHTML = "<p>Nenhuma lista encontrada. Crie uma nova!</p>";
            return;
        }

        let listas;
        try {
            listas = JSON.parse(textData);
        } catch (jsonError) {
            throw new Error("Erro ao interpretar a resposta JSON.");
        }

        // Garante que 'listas' seja um array
        if (!Array.isArray(listas)) {
            listas = [];
        }

        console.log("Listas recebidas:", listas);

        // Se o usuário ainda não tem listas, exibe uma mensagem amigável
        if (listas.length === 0) {
            console.warn("Nenhuma lista encontrada para este usuário.");
            listsContainer.innerHTML = "<p>Nenhuma lista encontrada. Crie uma nova!</p>";
            return;
        }

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
                localStorage.setItem("listaId", listaId);
                window.location.href = `editarLista.html?id=${listaId}`;
            }
        });

    } catch (error) {
        console.error("Erro ao buscar listas:", error);
        alert("Erro ao buscar listas no servidor. Tente novamente mais tarde.");
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
