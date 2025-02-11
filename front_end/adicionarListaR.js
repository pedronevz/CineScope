document.addEventListener("DOMContentLoaded", async function () {
    const moviesContainer = document.getElementById("moviesContainer");
    const addMovieButton = document.getElementById("addMovieButton");
    const selectedMoviesDiv = document.getElementById("selectedMovies");
    const addListForm = document.getElementById("addListForm");
    const userId = localStorage.getItem("sessaoId"); // Obtém o ID do usuário logado
    let selectedMovies = [];

    try {
        const response = await fetch("http://localhost:3000/filmes");
        const filmes = await response.json();
        
        if (!response.ok) {
            throw new Error("Erro ao carregar filmes");
        }

        filmes.forEach(filme => {
            const movieItem = document.createElement("div");
            movieItem.innerHTML = `
                <input type="checkbox" id="filme-${filme.id}" value="${filme.id}">
                <label for="filme-${filme.id}">${filme.titulo}</label>
            `;
            moviesContainer.appendChild(movieItem);
        });
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
    }

    addMovieButton.addEventListener("click", function () {
        const checkboxes = document.querySelectorAll("#moviesContainer input[type='checkbox']:checked");

        checkboxes.forEach(cb => {
            const movieId = cb.value;
            const movieLabel = document.querySelector(`label[for='filme-${movieId}']`).textContent;

            // Evita duplicação
            if (!selectedMovies.includes(movieId)) {
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
    });

    selectedMoviesDiv.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-movie")) {
            const movieId = event.target.getAttribute("data-id");
            selectedMovies = selectedMovies.filter(id => id !== movieId);

            // Remove da interface
            document.getElementById(`selected-${movieId}`).remove();
            document.getElementById(`filme-${movieId}`).checked = false; // Desmarca o checkbox
        }
    });

    addListForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const listName = document.getElementById("listName").value;

        try {
            const response = await fetch("http://localhost:3000/listas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nome: listName, usuarioId: userId })
            });

            if (!response.ok) {
                throw new Error("Erro ao criar lista");
            }

            const lista = await response.json();
            const listaId = lista.id;

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
            window.location.href = "home.html";
        } catch (error) {
            console.error("Erro ao criar lista:", error);
            alert("Erro ao criar lista");
        }
    });
});
