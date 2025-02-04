// CRUD
import pool from '../db.js';

// CREATE
export const criarReview = async (req, res) => {
    try {
        const { idfilme, idusuario } = req.params; 
        const { nota, texto } = req.body;

        // Verifica se o filme existe
        const filme = await pool.query('SELECT * FROM filmes WHERE id = $1', [idfilme]);
        if (filme.rows.length === 0) {
            return res.status(404).json({ erro: 'Filme não encontrado' });
        }

        // Verifica se o usuário existe
        const usuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [idusuario]);
        if (usuario.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        const novaReview = await pool.query(
            'INSERT INTO reviews (nota, texto, idfilme, idusuario) VALUES ($1, $2, $3, $4) RETURNING *',
            [nota, texto , idfilme, idusuario]
        );
        res.json(novaReview.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// READ
export const obterReviewPorUsuario = async (req, res) => {
    try {
        const { idusuario } = req.params;
        const todasReviewsUser = await pool.query('SELECT * FROM reviews WHERE idusuario = $1', [idusuario]);

        if (todasReviewsUser.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário sem reviews!' });

        }

        res.json(todasReviewsUser.rows);        

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const obterReviewPorFilme = async (req, res) => {
    try {
        const { idfilme } = req.params;
        const todasReviewsFilme = await pool.query('SELECT * FROM reviews WHERE idfilme = $1', [idfilme]);

        if (todasReviewsFilme.rows.length === 0) {
            return res.status(404).json({ erro: 'Filme sem reviews!' });
        }

        res.json(todasReviewsFilme.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const obterReviewFilmePorUsuario = async (req, res) => {
    try {
        const { idFilme, idUsuario } = req.params;
        const reviewFilmePorUsuario = await pool.query('SELECT * FROM reviews WHERE idfilme = $1 AND idusuario = $2', [idFilme, idUsuario]);
        res.json(reviewFilmePorUsuario.rows);

        if (reviewFilmePorUsuario.rows.length === 0) {
            return res.status(404).json({ erro: 'Review não encontrada' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// UPDATE
export const atualizarReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { nota, texto } = req.body;

        const camposParaAtualizar = [];
        const valores = [];

        // Verifica se a review existe
        const review = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
        if (review.rows.length === 0) {
            return res.status(404).json({ erro: 'Review não encontrada' });
        }

         if (nota !== undefined) {
            camposParaAtualizar.push('nota = $' + (valores.length + 1));
            valores.push(nota);
        }
        if (texto !== undefined) {
            camposParaAtualizar.push('texto = $' + (valores.length + 1));
            valores.push(texto);
        }
        
        // Se nenhum campo for fornecido, retorna um erro
        if (camposParaAtualizar.length === 0) {
            return res.status(400).json({ erro: 'Nenhum campo fornecido para atualização' });
        }

        valores.push(id);

        const query = `
            UPDATE reviews
            SET ${camposParaAtualizar.join(', ')}
            WHERE id = $${valores.length}
            RETURNING *;
        `;

        const reviewAtualizada = await pool.query(query, valores);
        res.json(reviewAtualizada.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// DELETE
export const deletarReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se a review existe
        const review = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
        if (review.rows.length === 0) {
            return res.status(404).json({ erro: 'Review não encontrada' });
        }

        await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
        res.json('Review deletada com sucesso!');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};
