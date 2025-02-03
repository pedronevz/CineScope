// CRUD
import pool from '../db.js';

// CREATE
export const criarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, data, bio } = req.body;
        const novoUsuario = await pool.query(
            'INSERT INTO usuarios (nome, email, senha, data_nasc, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, email, senha, data, bio]
        );
        res.json(novoUsuario.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// READ
export const obterUsuarios = async (req, res) => {
    try {
        const todosUsuarios = await pool.query('SELECT * FROM usuarios');
        res.json(todosUsuarios.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const obterUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        res.json(usuario.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// UPDATE
export const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, data, bio } = req.body;
        const usuarioAtualizado = await pool.query(
            'UPDATE usuarios SET nome = $1, email = $2, senha = $3, data_nasc = $4, bio = $5 WHERE id = $6 RETURNING *',
            [nome, email, senha, data, bio, id]
        );  
        res.json(usuarioAtualizado.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// DELETE
export const deletarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.json('Usuário deletado com sucesso!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const deletarTodosUsuarios = async (req, res) => {
    try {
        await pool.query('DELETE * FROM usuarios');
        res.json('Usuários deletados com sucesso!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};