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