document.addEventListener("DOMContentLoaded", async function () {
    const listasContainer = document.getElementById("listas-container");
    const userId = JSON.parse(localStorage.getItem("sessaoId")); // Supondo que o ID do usuário esteja armazenado no localStorage

    async function carregarListas() {
        try {
            const response = await fetch(`http://localhost:3000/listas/${userId}`); // Passa o ID do usuário
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || "Erro ao carregar a lista");
            }

            // Se data não for um objeto, lança um erro
            if (typeof data !== "object" || data === null) {
                throw new Error("A resposta da API não é um objeto válido");
            }

            listasContainer.innerHTML = ""; // Limpa o conteúdo antes de renderizar

            const listItem = document.createElement("div");
            listItem.classList.add("list-item");

            listItem.innerHTML = `
                <h3>${data.nome}</h3>
                <p>${data.descricao || "Sem descrição"}</p>
                <button class="btn btn-edit" data-id="${data.id}">Editar</button>
                <button class="btn btn-delete" data-id="${data.id}">Excluir</button>
            `;

            listasContainer.appendChild(listItem);

            // Adiciona evento para o botão de exclusão
            document.querySelector(".btn-delete").addEventListener("click", async function () {
                const listaId = this.getAttribute("data-id");
                await excluirLista(listaId);
            });
            //evento pro botão editar
            listItem.querySelector('.btn-edit').addEventListener('click', function() {
                const id = this.getAttribute('data-id'); // Obtém o valor do atributo data-id
                window.location.href = `editarLista.html?id=${id}`; // Redireciona para a página de edição com o ID como parâmetro
            });

        } catch (error) {
            console.error("Erro ao buscar lista:", error);
        }
    }

    async function excluirLista(id) {
        if (!confirm("Tem certeza que deseja excluir esta lista?")) return;

        try {
            const response = await fetch(`http://localhost:3000/listas/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir a lista");
            }

            alert("Lista excluída com sucesso!");
            carregarListas(); // Recarrega a lista após a exclusão

        } catch (error) {
            console.error("Erro ao excluir lista:", error);
        }
    }

    carregarListas(); // Chama a função ao carregar a página
});
