document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM carregado, iniciando script de edição...");

    const movieSelect = document.getElementById("movieSelect");
    const addMovieButton = document.getElementById("addMovieButton");
    const selectedMoviesDiv = document.getElementById("selectedMovies");
    const editListForm = document.getElementById("editListForm");
    const listNameInput = document.getElementById("listName");
    const listId = localStorage.getItem("listaId");
    
    let selectedMovies = [];
    let originalMovies = [];
    let filmesRemover = [];

    if (!movieSelect || !addMovieButton || !selectedMoviesDiv) {
        console.error("Erro: Elementos da página não encontrados.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/filmes");
        if (!response.ok) throw new Error("Erro ao carregar filmes");
        
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

    try {
        const response = await fetch(`http://localhost:3000/listas/${listId}`);
        if (!response.ok) throw new Error("Erro ao carregar informações da lista");
        
        const lista = await response.json();
        listNameInput.value = lista.nome;
    } catch (error) {
        console.error("Erro ao buscar informações da lista:", error);
    }

    try {
        const response = await fetch(`http://localhost:3000/listas/${listId}/filmes`);
        if (!response.ok) throw new Error("Erro ao carregar filmes da lista");
        
        const filmes = await response.json();
        originalMovies = filmes.map(filme => filme.id);
        selectedMovies = [...originalMovies];
        
        filmes.forEach(filme => {
            addMovieToDOM(filme.id, filme.titulo);
        });
    } catch (error) {
        console.error("Erro ao buscar filmes da lista:", error);
    }

    addMovieButton.addEventListener("click", function () {
        const movieId = movieSelect.value;
        const movieLabel = movieSelect.options[movieSelect.selectedIndex].textContent;

        if (movieId && !selectedMovies.includes(movieId)) {
            selectedMovies.push(movieId);
            filmesRemover = filmesRemover.filter(id => id !== movieId);
            addMovieToDOM(movieId, movieLabel);
        }
    });

    selectedMoviesDiv.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-movie")) {
            const movieId = Number(event.target.getAttribute("data-id"));
            selectedMovies = selectedMovies.filter(id => id !== movieId);
            
            if (originalMovies.includes(movieId)) {
                filmesRemover.push(movieId);
            }
            document.getElementById(`selected-${movieId}`).remove();
        }
    });

    editListForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const listName = listNameInput.value;
        const filmesAdicionar = selectedMovies.filter(id => !originalMovies.includes(id));
        
        try {
            await fetch(`http://localhost:3000/listas/${listId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome: listName })
            });
            
            await fetch(`http://localhost:3000/listas/${listId}/editarFilmes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filmesAdicionar, filmesRemover })
            });
            
            alert("Lista editada com sucesso!");
            window.location.href = "listasUser.html";
        } catch (error) {
            console.error("Erro ao editar lista:", error);
            alert("Erro ao editar lista");
        }
    });

    function addMovieToDOM(movieId, movieLabel) {
        const movieItem = document.createElement("div");
        movieItem.id = `selected-${movieId}`;
        movieItem.innerHTML = `
            ${movieLabel} 
            <button class="remove-movie" data-id="${movieId}">Remover</button>
        `;
        selectedMoviesDiv.appendChild(movieItem);
    }
});
