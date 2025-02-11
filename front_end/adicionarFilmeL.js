document.addEventListener("DOMContentLoaded", async function () {
    const movieSelect = document.getElementById("movieSelect");
    const addMovieButton = document.getElementById("addMovieButton");
    const selectedMoviesContainer = document.getElementById("selectedMovies");
    const addListForm = document.getElementById("addListForm");

    let selectedMovies = []; // Array para armazenar os filmes selecionados

    // Carregar os filmes no select
    try {
        const response = await fetch("http://localhost:3000/filmes");
        const filmes = await response.json();

        if (!response.ok) {
            throw new Error(filmes.erro || "Erro ao carregar os filmes");
        }

        movieSelect.innerHTML = '<option value="">Selecione um filme</option>';

        filmes.forEach(filme => {
            const option = document.createElement("option");
            option.value = filme.id;
            option.textContent = `${filme.titulo} (${filme.ano})`;
            movieSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
    }

    // Adicionar filme à lista de selecionados
    addMovieButton.addEventListener("click", function () {
        const selectedMovieId = movieSelect.value;
        const selectedMovieText = movieSelect.options[movieSelect.selectedIndex].text;

        if (!selectedMovieId) {
            alert("Selecione um filme antes de adicionar!");
            return;
        }

        // Evitar adicionar duplicatas
        if (selectedMovies.some(movie => movie.id === selectedMovieId)) {
            alert("Este filme já foi adicionado à lista!");
            return;
        }

        // Adicionar ao array de filmes selecionados
        selectedMovies.push({ id: selectedMovieId, titulo: selectedMovieText });

        // Atualizar a interface
        updateSelectedMoviesUI();
    });

    // Atualizar a interface de filmes selecionados
    function updateSelectedMoviesUI() {
        selectedMoviesContainer.innerHTML = "";
        selectedMovies.forEach(movie => {
            const movieDiv = document.createElement("div");
            movieDiv.textContent = movie.titulo;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remover";
            removeButton.addEventListener("click", () => {
                selectedMovies = selectedMovies.filter(m => m.id !== movie.id);
                updateSelectedMoviesUI();
            });

            movieDiv.appendChild(removeButton);
            selectedMoviesContainer.appendChild(movieDiv);
        });
    }

    // Enviar a lista com os filmes para o backend
    addListForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nomeLista = document.getElementById("listName").value;
        const descricao = document.getElementById("listDescription").value;

        if (!nomeLista.trim() || selectedMovies.length === 0) {
            alert("Preencha o nome da lista e selecione pelo menos um filme!");
            return;
        }

        // Obtendo o ID do usuário (supondo que esteja salvo no localStorage após login)
        const usuarioId = localStorage.getItem("usuarioId");
        if (!usuarioId) {
            alert("Erro: usuário não identificado.");
            return;
        }

        try {
            // Criar a lista no backend
            const response = await fetch("http://localhost:3000/listas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome: nomeLista, descricao, usuarioId })
            });

            if (!response.ok) {
                throw new Error("Erro ao criar a lista.");
            }

            const lista = await response.json();

            // Adicionar filmes à lista
            for (const movie of selectedMovies) {
                await fetch("http://localhost:3000/listas/adicionarFilme", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idLista: lista.id, idFilme: movie.id })
                });
            }

            alert("Lista criada com sucesso!");
            window.location.href = "home.html"; // Redireciona para a página principal

        } catch (error) {
            console.error("Erro ao criar lista:", error);
            alert("Erro ao criar a lista. Tente novamente.");
        }
    });
});
