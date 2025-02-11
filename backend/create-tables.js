import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'cinescope',
    password: '12345678', 
    //password: '0260902003',
    port: 5432,
});

// Função para criar as tabelas
async function createTables() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Cria as tabelas
        await client.query(`
            CREATE TABLE IF NOT EXISTS generos (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) UNIQUE NOT NULL,  
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS diretores (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) UNIQUE NOT NULL, 
                data_nasc DATE NOT NULL,
                foto_perfil TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(100) NOT NULL,
                data_nasc DATE NOT NULL,
                foto_perfil TEXT,
                bio VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS filmes (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(100) UNIQUE NOT NULL,
                ano INT NOT NULL,
                nota_media DECIMAL DEFAULT NULL,
                sinopse VARCHAR(1000) NOT NULL,
                foto_capa BYTEA,
                duracao TIME NOT NULL,
                genero INT REFERENCES generos(id) NOT NULL,
                diretor INT REFERENCES diretores(id) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                nota DECIMAL NOT NULL,
                texto VARCHAR(10000),
                idFilme INT REFERENCES filmes(id) ON DELETE CASCADE,
                idUsuario INT REFERENCES usuarios(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (idFilme, idUsuario)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS comentarios (
                id SERIAL PRIMARY KEY,
                texto VARCHAR(1000) NOT NULL,
                idUsuario INT REFERENCES usuarios(id) ON DELETE CASCADE,
                idReview INT REFERENCES reviews(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS listas (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                idUsuario INT REFERENCES usuarios(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS atores (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) UNIQUE NOT NULL, 
                data_nasc DATE NOT NULL,
                foto_perfil TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS noticias (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(100) NOT NULL, 
                conteudo TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS servicos_streaming (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS seguidores_usuarios (
                idSeguidor INT REFERENCES usuarios(id) ON DELETE CASCADE,
                idSeguido INT REFERENCES usuarios(id) ON DELETE CASCADE, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idSeguidor, idSeguido)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS filmes_listas (
                idLista INT REFERENCES listas(id) ON DELETE CASCADE,
                idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idLista, idFilme)
            );
        `);

       /*  await client.query(`
            CREATE TABLE IF NOT EXISTS users_listas (
                idLista INT REFERENCES listas(id) ON DELETE CASCADE,
                idUser INT REFERENCES usuarios(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idLista, idUser)
            );
        `); */

        await client.query(`
            CREATE TABLE IF NOT EXISTS filmes_atores (
                idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
                idAtor INT REFERENCES atores(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idFilme, idAtor)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS noticias_filmes (
                idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
                idNoticia INT REFERENCES noticias(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idFilme, idNoticia)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS filmes_streaming (
                idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
                idStreaming INT REFERENCES servicos_streaming(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idFilme, idStreaming)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS noticias_atores (
                idAtor INT REFERENCES atores(id) ON DELETE CASCADE, 
                idNoticia INT REFERENCES noticias(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idAtor, idNoticia)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS noticias_diretores (
                idProd INT REFERENCES diretores(id) ON DELETE CASCADE, 
                idNoticia INT REFERENCES noticias(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idProd, idNoticia)
            );
        `);

        await client.query(`
            CREATE VIEW usuario_seguro_view AS 
                SELECT id, nome, foto_perfil, bio, created_at
                FROM usuarios;
        `);

        await client.query(`
            CREATE FUNCTION login_usuario(p_nome VARCHAR(30), p_senha VARCHAR(30))
            RETURNS SETOF usuarios AS
            $func$
            DECLARE
                usuarios_tmp usuarios;
            BEGIN
                SELECT u.*
                FROM usuarios u
                WHERE u.nome = p_nome
                INTO usuarios_tmp;
                
                IF usuarios_tmp.senha = p_senha THEN
                    RETURN NEXT usuarios_tmp;
                    RETURN;
                END IF;
            END;
            $func$
            LANGUAGE plpgsql;
        `);

        await client.query('COMMIT');
        console.log('Tabelas criadas com sucesso!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar tabelas ou inserir dados:', err.message);
    } finally {
        client.release();
    }
}

createTables();