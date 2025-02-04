// CRUD
import pool from '../db.js';

// CREATE
export const criarReview = async (req, res) => {
    try {
        const { nota, texto, idfilme, idusuario } = req.body;
        const novaReview = await pool.query(
            'INSERT INTO filmes (nota, texto, idfilme, idusuario) VALUES ($1, $2, $3, $4) RETURNING *',
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
        const { idUsuario } = req.params;
        const todasReviewsUser = await pool.query('SELECT * FROM reviews WHERE idusuario = $1', [idUsuario]);
        res.json(todasReviewsUser.rows);

        if (todasReviewsUser=== 0) {
            return res.status(404).json({ erro: 'Usuário sem reviews!' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const obterReviewPorFilme = async (req, res) => {
    try {
        const { idFilme } = req.params;
        const todasReviewsFilme = await pool.query('SELECT * FROM reviews WHERE id = $1', [idFilme]);
        res.json(todasReviewsFilme.rows[0]);

        if (todasReviewsFilme=== 0) {
            return res.status(404).json({ erro: 'Filme sem reviews!' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const obterReviewFilmePorUsuario = async (req, res) => {
    try {
        const { idFilme, idUsuario } = req.params;
        const reviewFilmePorUsuario = await pool.query('SELECT * FROM reviews WHERE idfilme = $1 AND idusuario = $2', [idFilme, idUsuario]);
        res.json(reviewFilmePorUsuario.rows[0]);

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
        await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
        res.json('Review deletada com sucesso!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};
