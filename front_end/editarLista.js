document.addEventListener('DOMContentLoaded', function () {
    const selectedMovies = document.getElementById('selectedMovies');
    const editListForm = document.getElementById('editListForm');
    const listNameInput = document.getElementById('listName');
    const params = new URLSearchParams(window.location.search);
    const listaId = params.get("id");

    console.log('ID da lista:', listaId); // Verifique o ID da lista

    // Função para carregar os detalhes da lista (nome da lista)
    async function carregarDetalhesDaLista(idLista) {
        try {
            const response = await fetch(`http://localhost:3000/listas/${idLista}`);
            console.log('Resposta da API (detalhes da lista):', response); // Verifique a resposta
            if (!response.ok) {
                throw new Error('Erro ao carregar detalhes da lista');
            }
            const lista = await response.json();
            console.log('Detalhes da lista:', lista); // Verifique os detalhes da lista
            preencherFormulario(lista);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // Função para preencher o formulário com os dados da lista
    function preencherFormulario(lista) {
        listNameInput.value = lista.nome; // Preenche o campo do nome da lista
    }

    // Função para carregar os filmes da lista
    async function carregarFilmesDaLista(idLista) {
        try {
            const response = await fetch(`http://localhost:3000/listas/${idLista}/filmes`);
            console.log('Resposta da API (filmes da lista):', response); // Verifique a resposta
            if (!response.ok) {
                throw new Error('Erro ao carregar filmes da lista');
            }
            const filmes = await response.json();
            console.log('Filmes retornados:', filmes); // Verifique os filmes
            exibirFilmes(filmes);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // Função para exibir os filmes na interface
    function exibirFilmes(filmes) {
        console.log('Exibindo filmes:', filmes); // Verifique os filmes recebidos
        selectedMovies.innerHTML = ''; // Limpa a lista atual
        filmes.forEach(filme => {
            const filmeDiv = document.createElement('div');
            filmeDiv.innerHTML = `
                <span>${filme.titulo} (${filme.ano})</span>
                <button onclick="removerFilmeDaLista(${listaId}, ${filme.id})">Remover</button>
            `;
            selectedMovies.appendChild(filmeDiv);
        });
    }

    // Função para carregar os filmes disponíveis no dropdown
    async function carregarFilmesDisponiveis() {
        try {
            const response = await fetch('http://localhost:3000/filmes'); // Rota para buscar todos os filmes
            if (!response.ok) {
                throw new Error('Erro ao carregar filmes disponíveis');
            }
            const filmes = await response.json();
            preencherDropdown(filmes);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // Função para preencher o dropdown com os filmes
    function preencherDropdown(filmes) {
        const dropdown = document.getElementById('filmesDropdown');
        dropdown.innerHTML = '<option value="">Selecione um filme</option>'; // Limpa o dropdown

        filmes.forEach(filme => {
            const option = document.createElement('option');
            option.value = filme.id; // Valor do option é o ID do filme
            option.textContent = `${filme.titulo} (${filme.ano})`; // Texto exibido no dropdown
            dropdown.appendChild(option);
        });
    }

    // Função para adicionar o filme selecionado à lista
    document.getElementById('btnAdicionarFilme').addEventListener('click', async function () {
        const dropdown = document.getElementById('filmesDropdown');
        const filmeId = dropdown.value; // ID do filme selecionado
       
        if (!filmeId) {
            alert('Selecione um filme para adicionar à lista.');
            return;
        }

        if (!listaId) {
            alert('ID da lista não encontrado.');
            return;
        }

        try {
            await adicionarFilmeALista(listaId, filmeId); // Adiciona o filme à lista
            carregarFilmesDaLista(listaId); // Recarrega os filmes da lista
            dropdown.value = ''; // Reseta o dropdown
        } catch (error) {
            console.error('Erro ao adicionar filme:', error);
        }
    });

    // Função para adicionar um filme à lista
    async function adicionarFilmeALista(idLista, idFilme) {
        try {
            const response = await fetch('http://localhost:3000/listas/adicionarFilme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idLista, idFilme }),
            });
            if (!response.ok) {
                throw new Error('Erro ao adicionar filme à lista');
            }
            const resultado = await response.json();
            console.log('Filme adicionado:', resultado);
        } catch (error) {
            console.error('Erro:', error);
            throw error; // Propaga o erro para ser tratado no chamador
        }
    }

    
    if (listaId) {
        carregarDetalhesDaLista(listaId); // Carrega o nome da lista
        carregarFilmesDaLista(listaId);   // Carrega os filmes da lista
        carregarFilmesDisponiveis();      // Carrega os filmes disponíveis no dropdown
    }
});