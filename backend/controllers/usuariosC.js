// CRUD
import pool from '../db.js';

// CREATE
export const criarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, data, bio } = req.body;

        // Verifica se o nome já existe
        const nomeExiste = await pool.query('SELECT * FROM usuarios WHERE nome = $1', [nome]);
        if(nomeExiste.rows.length !== 0){
            return res.status(404).json({ erro: 'Nome já existente!' });
        }

        // Verifica se o email já existe
        const emailExiste = await pool.query('SELECT * FROM usuarios WHERE nome = $1', [nome]);
        if(emailExiste.rows.length !== 0){
            return res.status(404).json({ erro: 'Email já existente!' });
        }

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

        if(todosUsuarios.rows.length === 0){
            return res.status(404).json({ erro: 'Não há usuários!' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const obterUsuariosSeguro = async (req, res) => {
    try {
        const todosUsuarios = await pool.query('SELECT * FROM usuario_seguro_view');
        res.json(todosUsuarios.rows);

        if(todosUsuarios.rows.length === 0){
            return res.status(404).json({ erro: 'Não há usuários!' });
        }

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

        if(usuario.rows.length === 0){
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const login = async (req, res) => {
    try {
        const { nome, senha } = req.body;

        if (nome === undefined) {
            return res.status(400).json({ erro: 'Preencha o nome de usuário!' })
        }

        if (senha === undefined) {
            return res.status(400).json({ erro: 'Preencha a senha!' })
        }

        const usuario = await pool.query('SELECT * FROM login_usuario($1, $2)', [nome, senha]);

        if(usuario.rows.length === 0){
            return res.status(404).json({ erro: 'Nome ou senha incorretos!' });
        }

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
        const { nome, email, senha, bio } = req.body;

        const camposParaAtualizar = [];
        const valores = [];

        // Verifica se o usuário existe
        const usuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (usuario.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

         if (nome !== undefined) {
            camposParaAtualizar.push('nome = $' + (valores.length + 1));
            valores.push(nome);
        }
        if (email !== undefined) {
            camposParaAtualizar.push('email = $' + (valores.length + 1));
            valores.push(email);
        }
        if (senha !== undefined) {
            camposParaAtualizar.push('senha = $' + (valores.length + 1));
            valores.push(senha);
        }
        if (bio !== undefined) {
            camposParaAtualizar.push('bio = $' + (valores.length + 1));
            valores.push(bio);
        }

        // Se nenhum campo for fornecido, retorna um erro
        if (camposParaAtualizar.length === 0) {
            return res.status(400).json({ erro: 'Nenhum campo fornecido para atualização' });
        }

        valores.push(id);

        const query = `
            UPDATE usuarios
            SET ${camposParaAtualizar.join(', ')}
            WHERE id = $${valores.length}
            RETURNING *;
        `;

        const usuarioAtualizado = await pool.query(query, valores);
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

        // Verifica se o usuário existe
        const usuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (usuario.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.json('Usuário deletado com sucesso!');
      
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

export const deletarTodosUsuarios = async (req, res) => {
    try {
        await pool.query('DELETE FROM usuarios');
        res.json('Usuários deletados com sucesso!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};