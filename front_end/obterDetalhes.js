document.addEventListener('DOMContentLoaded', function () {
    const reviewsContainer = document.getElementById('reviews');

    // Captura o ID do filme da URL
    const urlParams = new URLSearchParams(window.location.search);
    const filmeId = urlParams.get('id');

    if (filmeId) {
        obterFilmeDetalhado(filmeId);
    } else {
        console.error("ID do filme não encontrado na URL.");
    }

    async function obterFilmeDetalhado(id) {
        try {
            const response = await fetch(`http://localhost:3000/filmes/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao obter detalhes do filme');
            }
            const filme = await response.json();
            preencherDetalhesFilme(filme);
        } catch (error) {
            console.error(error);
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
        
        if (filme.foto_capa) {
            const fotoCapa = document.getElementById('movie-poster');
            fotoCapa.src = `data:image/jpeg;base64,${filme.foto_capa}`;
        }
        
        preencherReviews(filme.reviews);
    }

    function preencherReviews(reviews) {
        reviewsContainer.innerHTML = '';
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