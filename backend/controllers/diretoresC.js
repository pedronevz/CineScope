// CRUD
import pool from '../db.js';


// READ
export const obterDiretorEFilmes = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT nome, data_nasc FROM diretores WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Diretor não encontrado' });
        }

        const filmesResult = await pool.query(
            'SELECT id, titulo, ano FROM filmes WHERE diretor = $1',
            [id]
        );

        const diretor = result.rows[0];
        diretor.filmes = filmesResult.rows; 

        res.json(diretor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};