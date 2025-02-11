document.addEventListener('DOMContentLoaded', function () {
    const reviewsContainer = document.getElementById('reviews');

    // Captura o ID do filme da URL
    const filmeId = localStorage.getItem("filmeSelecionado");

    // Verifica se o ID do filme foi passado na URL
    if (!filmeId) {
        console.error("ID do filme não encontrado na URL.");
        alert("Erro: ID do filme não encontrado.");
        return;
    }

    // Obtém os detalhes do filme
    obterFilmeDetalhado(filmeId);

    async function obterFilmeDetalhado(id) {
        try {
            const response = await fetch(`http://localhost:3000/filmes/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao obter detalhes do filme');
            }
            const filme = await response.json();

            // Verifica se os dados do filme são válidos
            if (!filme || !filme.titulo) {
                console.error("Dados do filme incompletos ou inválidos.");
                alert("Erro: Dados do filme incompletos.");
                return;
            }

            // Preenche os detalhes do filme na página
            preencherDetalhesFilme(filme);
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar detalhes do filme. Tente novamente.");
        }
    }

    function preencherDetalhesFilme(filme) {
        document.getElementById('movie-name').innerText = filme.titulo;
        document.getElementById('genre').innerText = `Gênero: ${filme.genero}`;
        document.getElementById('duration').innerText = `Duração: ${filme.duracao}h`;
        document.getElementById('streaming').innerText = `Streamings: ${filme.streamings.join(', ')}`;
        document.getElementById('rating').innerText = `Nota: ${filme.nota_media}`;
        document.getElementById('director').innerHTML = `Diretor: <a href="diretor1.html">${filme.diretor}</a>`;
        document.getElementById('actors').innerHTML = `Atores: ${filme.atores.map((ator, index) => `<a href="ator${index + 1}.html">${ator}</a>`).join(', ')}`;
        document.getElementById('synopsis').innerText = filme.sinopse;

        // Exibe a foto de capa (se existir)
        if (filme.foto_capa) {
            const fotoCapa = document.getElementById('movie-poster');
            fotoCapa.src = `data:image/jpeg;base64,${filme.foto_capa}`;
        }

        // Preenche as reviews (se existirem)
        if (filme.reviews && Array.isArray(filme.reviews)) {
            preencherReviews(filme.reviews);
        } else {
            console.error("Reviews não encontradas ou formato inválido.");
        }
    }

    function preencherReviews(reviews) {
        reviewsContainer.innerHTML = ''; // Limpa o conteúdo anterior
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');
            reviewElement.innerHTML = `
                <p class="rating">Nota: ${review.nota}</p>
                <p>${review.texto}</p>
                <p><strong>${review.usuario}</strong></p>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    }
});