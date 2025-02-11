// CRUD
import pool from '../db.js';


// READ
export const obterFilmes = async (req, res) => {
    try {
        const todosFilmes = await pool.query('SELECT * FROM filmes');
        res.json(todosFilmes.rows);

        if(todosFilmes.rows.length === 0){
            return res.status(404).json({ erro: 'Não há filmes!' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const obterFilmeDetalhado = async (req, res) => {
    const { id } = req.params; 

    try {
        const client = await pool.connect();

        const filmeQuery = `
            SELECT f.*, g.nome AS genero, d.nome AS diretor, d.id AS diretor_id
            FROM filmes f
            JOIN generos g ON f.genero = g.id
            JOIN diretores d ON f.diretor = d.id
            WHERE f.id = $1;
        `;

        const filmeResult = await client.query(filmeQuery, [id]);
        const filme = filmeResult.rows[0];

        if (!filme) {
            return res.status(404).json({ erro: 'Filme não encontrado' });
        }

        // Busca atores
        const atoresQuery = `
            SELECT a.id, a.nome 
            FROM atores a
            JOIN filmes_atores fa ON a.id = fa.idAtor
            WHERE fa.idFilme = $1;
            `;

        const atoresResult = await client.query(atoresQuery, [id]);
        const atores = atoresResult.rows.map(row => ({
            id: row.id,
            nome: row.nome
        }));

        // Busca streamings
        const streamingQuery = `
            SELECT s.nome
            FROM servicos_streaming s
            JOIN filmes_streaming fs ON s.id = fs.idStreaming
            WHERE fs.idFilme = $1;
        `;
        const streamingResult = await client.query(streamingQuery, [id]);
        const streamings = streamingResult.rows.map(row => row.nome);

        // Busca as reviews
        const reviewsQuery = `
            SELECT r.nota, r.texto, u.nome AS usuario
            FROM reviews r
            JOIN usuarios u ON r.idUsuario = u.id
            WHERE r.idFilme = $1;
        `;
        const reviewsResult = await client.query(reviewsQuery, [id]);
        const reviews = reviewsResult.rows;

        // Converte a foto_capa (buffer) para base64
        const fotoCapaBase64 = filme.foto_capa ? filme.foto_capa.toString('base64') : null;

        // Monta o objeto
        const resposta = {
            id: filme.id,
            titulo: filme.titulo,
            ano: filme.ano,
            sinopse: filme.sinopse,
            duracao: filme.duracao,
            nota_media: filme.nota_media,
            genero: filme.genero,
            diretor: {
                id: filme.diretor_id,
                nome: filme.diretor,
            },
            foto_capa: fotoCapaBase64,
            atores: atores,
            streamings: streamings,
            reviews: reviews,
        };

        res.json(resposta);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};