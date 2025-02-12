document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const listaId = urlParams.get("id"); // Obtém o ID da lista da URL
    const editListForm = document.getElementById("editListForm");
    const listNameInput = document.getElementById("listName");
    const selectedMoviesDiv = document.getElementById("selectedMovies");
    let selectedMovies = [];

    if (!listaId) {
        alert("ID da lista não encontrado na URL.");
        window.location.href = "listasUser.html";
        return;
    }

    try {
        // Carrega os dados da lista
        const listaResponse = await fetch(`http://localhost:3000/listas/${listaId}`);
        if (!listaResponse.ok) {
            throw new Error("Erro ao carregar lista");
        }
        const lista = await listaResponse.json();

        // Preenche o nome da lista
        listNameInput.value = lista.nome;

        // Carrega os filmes da lista
        const filmesResponse = await fetch(`http://localhost:3000/listas/${listaId}/filmes`);
        if (!filmesResponse.ok) {
            throw new Error("Erro ao carregar filmes da lista");
        }
        const filmes = await filmesResponse.json();

        // Exibe os filmes da lista
        filmes.forEach(filme => {
            selectedMovies.push(filme.id);
            const movieItem = document.createElement("div");
            movieItem.id = `selected-${filme.id}`;
            movieItem.innerHTML = `
                ${filme.titulo} 
                <button class="remove-movie" id="remove_movie" data-id="${filme.id}">Remover</button>
            `;
            selectedMoviesDiv.appendChild(movieItem);
        });

        // Carrega todos os filmes disponíveis para adicionar à lista
        const todosFilmesResponse = await fetch("http://localhost:3000/filmes");
        if (!todosFilmesResponse.ok) {
            throw new Error("Erro ao carregar filmes");
        }
        const todosFilmes = await todosFilmesResponse.json();

        // Adiciona os filmes ao dropdown (se necessário)
        const movieSelect = document.createElement("select");
        movieSelect.id = "movieSelect";
        movieSelect.innerHTML = `<option value="">Selecione um filme</option>`;
        todosFilmes.forEach(filme => {
            if (!selectedMovies.includes(filme.id)) {
                const option = document.createElement("option");
                option.value = filme.id;
                option.textContent = filme.titulo;
                movieSelect.appendChild(option);
            }
        });

        const addMovieButton = document.createElement("button");
        addMovieButton.type = "button";
        addMovieButton.textContent = "Adicionar Filme";
        addMovieButton.addEventListener("click", function () {
            const movieId = movieSelect.value;
            const movieLabel = movieSelect.options[movieSelect.selectedIndex].textContent;

            if (movieId && !selectedMovies.includes(movieId)) {
                selectedMovies.push(movieId);

                const movieItem = document.createElement("div");
                movieItem.id = `selected-${movieId}`;
                movieItem.innerHTML = `
                    ${movieLabel} 
                    <button class="remove-movie" data-id="${movieId}">Remover</button>
                `;
                selectedMoviesDiv.appendChild(movieItem);

                // Remove o filme do dropdown
                movieSelect.remove(movieSelect.selectedIndex);
            }
        });

        editListForm.insertBefore(movieSelect, selectedMoviesDiv);
        editListForm.insertBefore(addMovieButton, selectedMoviesDiv);

        // Remove filmes da lista
        selectedMoviesDiv.addEventListener("click", function (event) {
            if (event.target.classList.contains("remove-movie")) {
                const movieId = event.target.getAttribute("data-id");
                selectedMovies = selectedMovies.filter(id => id !== movieId);

                // Remove da interface
                document.getElementById(`selected-${movieId}`).remove();

                // Adiciona o filme de volta ao dropdown
                const filme = todosFilmes.find(f => f.id == movieId);
                if (filme) {
                    const option = document.createElement("option");
                    option.value = filme.id;
                    option.textContent = filme.titulo;
                    movieSelect.appendChild(option);
                }
            }
        });

        editListForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const listName = listNameInput.value;

            try {
                // Atualiza o nome da lista
                const updateResponse = await fetch(`http://localhost:3000/listas/${listaId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nome: listName })
                });

                if (!updateResponse.ok) {
                    throw new Error("Erro ao atualizar lista");
                }

                // Atualiza os filmes da lista
                const filmesAtuaisResponse = await fetch(`http://localhost:3000/listas/${listaId}/filmes`);
                if (!filmesAtuaisResponse.ok) {
                    throw new Error("Erro ao carregar filmes da lista");
                }
                const filmesAtuais = await filmesAtuaisResponse.json();
                const filmesAtuaisIds = filmesAtuais.map(f => f.id);

                // Identifica filmes a serem adicionados e removidos
                const filmesAdicionar = selectedMovies.filter(id => !filmesAtuaisIds.includes(id));
                const filmesRemover = filmesAtuaisIds.filter(id => !selectedMovies.includes(id));

                // Chama a função editarFilmes
                const editarFilmesResponse = await fetch(`http://localhost:3000/listas/${listaId}/editarFilmes`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ filmesAdicionar, filmesRemover })
                });

                console.log(filmesRemover)
                if (!editarFilmesResponse.ok) {
                    throw new Error("Erro ao atualizar filmes da lista");
                }

                alert("Lista atualizada com sucesso!");
                window.location.href = "listasUser.html";
            } catch (error) {
                console.error("Erro ao atualizar lista:", error);
                alert("Erro ao atualizar lista");
            }
        });
    } catch (error) {
        console.error("Erro ao carregar dados da lista:", error);
        alert("Erro ao carregar dados da lista");
    }
});