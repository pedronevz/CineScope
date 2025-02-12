document.addEventListener("DOMContentLoaded", async function () {
    const movieSelect = document.getElementById("movieSelect");
    const addMovieButton = document.getElementById("addMovieButton");
    const selectedMoviesDiv = document.getElementById("selectedMovies");
    const addListForm = document.getElementById("addListForm");
    const userId = localStorage.getItem("sessaoId"); // Obtém o ID do usuário logado
    let selectedMovies = [];

    // Carrega os filmes
    try {
        const response = await fetch("http://localhost:3000/filmes");
        if (!response.ok) {
            throw new Error("Erro ao carregar filmes");
        }
        const filmes = await response.json();
        filmes.forEach(filme => {
            const option = document.createElement("option");
            option.value = filme.id;
            option.textContent = filme.titulo;
            movieSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
    }

    // Adiciona filmes à lista
    addMovieButton.addEventListener("click", function () {
        const movieId = movieSelect.value;
        const movieLabel = movieSelect.options[movieSelect.selectedIndex].textContent;

        // Evita duplicação
        if (movieId && !selectedMovies.includes(movieId)) {
            selectedMovies.push(movieId);

            const movieItem = document.createElement("div");
            movieItem.id = `selected-${movieId}`;
            movieItem.innerHTML = `
                ${movieLabel} 
                <button class="remove-movie" data-id="${movieId}">Remover</button>
            `;
            selectedMoviesDiv.appendChild(movieItem);
        }
    });

    // Remove filmes da lista
    selectedMoviesDiv.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-movie")) {
            const movieId = event.target.getAttribute("data-id");
            selectedMovies = selectedMovies.filter(id => id !== movieId);

            // Remove da interface
            document.getElementById(`selected-${movieId}`).remove();
        }
    });

    // Cria a lista e associa filmes
    addListForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const listName = document.getElementById("listName").value;

        try {
            // Cria a lista
            const response = await fetch("http://localhost:3000/listas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nome: listName, idusuario: userId })
            });

            if (!response.ok) {
                throw new Error("Erro ao criar lista");
            }

            const lista = await response.json();
            const listaId = lista.id;

            // Adiciona os filmes à lista
            for (const movieId of selectedMovies) {
                await fetch("http://localhost:3000/listas/adicionarFilme", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ idLista: listaId, idFilme: movieId })
                });
            }

            alert("Lista criada com sucesso!");
            window.location.href = "listasUser.html";
        } catch (error) {
            console.error("Erro ao criar lista:", error);
            alert("Erro ao criar lista");
        }
    });
});