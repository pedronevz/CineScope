// CRUD
import pool from '../db.js';

// CREATE
export const criarLista = async (req, res) => {
    const { nome, iduser } = req.body; // Adiciona idUsuario ao corpo da requisição

    if (!nome || !iduser) {
        return res.status(400).json({ erro: 'Nome da lista e ID do usuário são obrigatórios' });
    }

    const client = await pool.connect();

    try {
        // Inicia uma transação
        await client.query('BEGIN');

        const queryInserirLista = 'INSERT INTO listas (nome) VALUES ($1) RETURNING *;';
        const resultadoLista = await client.query(queryInserirLista, [nome]);

        if (resultadoLista.rows.length === 0) {
            throw new Error('Erro ao criar lista');
        }

        const listaCriada = resultadoLista.rows[0];
        const idLista = listaCriada.id;

        const queryInserirAssociacao = 'INSERT INTO users_listas (iduser, idlista) VALUES ($1, $2) RETURNING *;';
        const resultadoAssociacao = await client.query(queryInserirAssociacao, [iduser, idLista]);

        if (resultadoAssociacao.rows.length === 0) {
            throw new Error('Erro ao associar lista ao usuário');
        }


        await client.query('COMMIT');

        // Retorna a lista criada e a associação
        res.status(201).json({
            lista: listaCriada,
            associacao: resultadoAssociacao.rows[0],
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Erro ao criar lista ou associar ao usuário');
    } finally {

        client.release();
    }
};

export const adicionarFilmeALista = async (req, res) => {
    const { idLista, idFilme } = req.body;

    try {
        const client = await pool.connect();
        const query = 'INSERT INTO filmes_listas (idLista, idFilme) VALUES ($1, $2) RETURNING *;';
        const resultado = await client.query(query, [idLista, idFilme]);
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao adicionar filme à lista');
    }
};

// READ
export const lerLista = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await pool.connect();

        const listaQuery = 'SELECT * FROM listas WHERE id = $1;';
        const listaResult = await client.query(listaQuery, [id]);

        if (listaResult.rows.length === 0) {
            return res.status(404).json({ erro: 'Lista não encontrada' });
        }

        const lista = listaResult.rows[0];

        // Busca os filmes da lista
        const filmesQuery = `
            SELECT f.*
            FROM filmes f
            JOIN filmes_listas fl ON f.id = fl.idFilme
            WHERE fl.idLista = $1;
        `;
        const filmesResult = await client.query(filmesQuery, [id]);
        const filmes = filmesResult.rows;

        // Retorna a lista com os filmes
        res.json({
            ...lista,
            filmes: filmes,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao ler lista');
    }
};

// READ
export const lerListaPorId = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const client = await pool.connect();

        const listaQuery = 'SELECT * FROM listas WHERE id = $1;';
        const listaResult = await client.query(listaQuery, [id]);

        if (listaResult.rows.length === 0) {
            return res.status(404).json({ erro: 'Lista não encontrada' });
        }

        const lista = listaResult.rows[0];

        // Busca os filmes da lista
        const filmesQuery = `
            SELECT f.*
            FROM filmes f
            JOIN filmes_listas fl ON f.id = fl.idFilme
            WHERE fl.idLista = $1;
        `;
        const filmesResult = await client.query(filmesQuery, [id]);
        const filmes = filmesResult.rows;

        // Retorna a lista com os filmes
        res.json({
            ...lista,
            filmes: filmes,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao ler lista');
    }
};

// DELETE
export const removerFilmeDaLista = async (req, res) => {
    const { idLista, idFilme } = req.params;

    try {
        const client = await pool.connect();
        const query = 'DELETE FROM filmes_listas WHERE idLista = $1 AND idFilme = $2;';
        await client.query(query, [idLista, idFilme]);
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao remover filme da lista');
    }
};

export const removerLista = async (req, res) => {
    const { id } = req.params;

    // Verifica se lista existe
    const lista = await pool.query('SELECT * FROM listas WHERE id = $1', [id]);
    if (lista.rows.length === 0) {
        return res.status(404).json({ erro: 'Lista não encontrada' });
    }

    try {
        const client = await pool.connect();
        const query = 'DELETE FROM listas WHERE id = $1';

        await client.query(query, [id]);
        res.status(204).send('Lista deletada com sucesso!');
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao remover lista');
    }
};

// UPDATE
export const editarLista = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    try {
        const client = await pool.connect();
        const query = 'UPDATE listas SET nome = $1 WHERE id = $2 RETURNING *;';
        const resultado = await client.query(query, [nome, id]);
        res.json(resultado.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao editar lista');
    }
};

