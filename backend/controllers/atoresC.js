// CRUD
import pool from '../db.js';


// READ
export const obterAtorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT nome, data_nasc FROM atores WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Ator não encontrado' });
        }

        const filmesResult = await pool.query(
            `SELECT f.id, f.titulo, f.ano 
             FROM filmes f
             JOIN filmes_atores fa ON f.id = fa.idFilme
             WHERE fa.idAtor = $1`,
            [id]
        );

        const ator = result.rows[0];
        ator.filmes = filmesResult.rows; 

        res.json(ator);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};