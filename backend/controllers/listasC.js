// CRUD
import pool from '../db.js';

// CREATE
export const criarLista = async (req, res) => {
    const { nome, idusuario } = req.body;

    // Verifica se os campos obrigatórios foram fornecidos
    if (!nome || !idusuario) {
        return res.status(400).json({ erro: 'Nome da lista e ID do usuário são obrigatórios' });
    }

    try {
        const query = `
            INSERT INTO listas (nome, idusuario)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const resultado = await pool.query(query, [nome, idusuario]);

        // Verifica se a lista foi criada com sucesso
        if (resultado.rows.length === 0) {
            throw new Error('Erro ao criar lista');
        }

        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao criar lista');
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
            SELECT f.id, f.titulo, f.ano
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

export const lerListaPorId = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const client = await pool.connect();

        // Buscar as listas associadas ao usuário
        const listaQuery = 'SELECT * FROM listas WHERE idusuario = $1;';
        const listaResult = await client.query(listaQuery, [idUsuario]);

        if (listaResult.rows.length === 0) {
            return res.status(404).json({ erro: 'Nenhuma lista encontrada para este usuário' });
        }

        // Para cada lista, buscar os filmes associados
        const listasComFilmes = [];

        for (const lista of listaResult.rows) {
            const filmesQuery = `
                SELECT f.id, f.titulo, f.ano
                FROM filmes f
                JOIN filmes_listas fl ON f.id = fl.idFilme
                WHERE fl.idLista = $1;
            `;
            const filmesResult = await client.query(filmesQuery, [lista.id]);
            const filmes = filmesResult.rows;

            listasComFilmes.push({
                ...lista,
                filmes: filmes,
            });
        }

        // Retorna as listas e seus filmes
        res.json(listasComFilmes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao ler listas do usuário');
    }
};

export const obterFilmesDaLista = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT f.*
            FROM filmes f
            JOIN filmes_listas fl ON f.id = fl.idFilme
            WHERE fl.idLista = $1;
        `;
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao buscar filmes da lista');
    }
};

// DELETE
export const removerFilmeDaLista = async (req, res) => {
    const { idLista, idFilme } = req.params;

    try {
        const query = 'DELETE FROM filmes_listas WHERE idLista = $1 AND idFilme = $2;';
        await pool.query(query, [idLista, idFilme]);

        res.status(204).send(); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: 'Erro ao remover filme da lista' });
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

export const editarFilmes = async (req, res) => {
    const { id } = req.params; // ID da lista
    const { filmesAdicionar, filmesRemover } = req.body; 

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); 

        // Remove filmes da lista
        if (filmesRemover && filmesRemover.length > 0) {
            for (const filmeId of filmesRemover) {
                await client.query(
                    'DELETE FROM filmes_listas WHERE idLista = $1 AND idFilme = $2;',
                    [id, filmeId]
                );
            }
        }

        // Adiciona filmes à lista
        if (filmesAdicionar && filmesAdicionar.length > 0) {
            for (const filmeId of filmesAdicionar) {
                await client.query(
                    'INSERT INTO filmes_listas (idLista, idFilme) VALUES ($1, $2) ON CONFLICT (idLista, idFilme) DO NOTHING;',
                    [id, filmeId]
                );
            }
        }

        await client.query('COMMIT'); 
        res.status(200).json({ mensagem: 'Filmes da lista atualizados com sucesso!' });
    } catch (err) {
        await client.query('ROLLBACK'); 
        console.error(err.message);
        res.status(500).send('Erro ao atualizar filmes da lista');
    } finally {
        client.release(); 
    }
};

