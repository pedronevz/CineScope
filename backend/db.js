import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'cinescope',
    password: '12345678', 
    port: 5432,
});

// SQL para criar tabelas
const createTablesQueries = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(100) NOT NULL,
        data_nasc DATE NOT NULL,
        foto_perfil TEXT,
        bio VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS filmes (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(100) UNIQUE NOT NULL,
        ano INT NOT NULL,
        nota_media DECIMAL DEFAULT NULL,
        sinopse VARCHAR(1000) NOT NULL,
        foto_capa TEXT,
        duracao TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        nota DECIMAL NOT NULL,
        idFilme INT REFERENCES filmes(id) ON DELETE CASCADE,
        idUsuario INT REFERENCES usuarios(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comentarios (
        id SERIAL PRIMARY KEY,
        texto VARCHAR(1000) NOT NULL,
        idUsuario INT REFERENCES usuarios(id) ON DELETE CASCADE,
        idReview INT REFERENCES reviews(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS listas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL, 
        descricao VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS atores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL, 
        data_nasc DATE NOT NULL,
        foto_perfil TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS noticias (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL, 
        conteúdo TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS produtores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL, 
        data_nasc DATE NOT NULL,
        foto_perfil TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS servicos_streaming (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL, 
        url VARCHAR(100) NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS generos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,  
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS seguidores_usuarios (
        idSeguidor INT REFERENCES usuarios(id) ON DELETE CASCADE,
        idSeguido INT REFERENCES usuarios(id) ON DELETE CASCADE, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idSeguidor, idSeguido)
    );

    CREATE TABLE IF NOT EXISTS filmes_users (
        idUser INT REFERENCES usuarios(id) ON DELETE CASCADE,
        idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idUser, idFilme)
    );

    CREATE TABLE IF NOT EXISTS filmes_listas (
        idLista INT REFERENCES listas(id) ON DELETE CASCADE,
        idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idLista, idFilme)
    );
    
    CREATE TABLE IF NOT EXISTS users_listas (
        idLista INT REFERENCES listas(id) ON DELETE CASCADE,
        idUser INT REFERENCES usuarios(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idLista, idUser)
    );

    CREATE TABLE IF NOT EXISTS filmes_atores (
        idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
        idAtor INT REFERENCES atores(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idFilme, idAtor)
    );

    CREATE TABLE IF NOT EXISTS noticias_filmes (
        idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
        idNoticia INT REFERENCES noticias(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idFilme, idNoticia)
    );

    CREATE TABLE IF NOT EXISTS filmes_prod (
        idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
        idProd INT REFERENCES produtores(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idFilme, idProd)
    );

    CREATE TABLE IF NOT EXISTS filmes_str (
        idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
        idStreaming INT REFERENCES servicos_streaming(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idFilme, idStreaming)
    );

    CREATE TABLE IF NOT EXISTS filmes_gen (
        idFilme INT REFERENCES filmes(id) ON DELETE CASCADE, 
        idGen INT REFERENCES generos(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idFilme, idGen)
    );

    CREATE TABLE IF NOT EXISTS noticias_atores (
        idAtor INT REFERENCES atores(id) ON DELETE CASCADE, 
        idNoticia INT REFERENCES noticias(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idAtor, idNoticia)
    );

    CREATE TABLE IF NOT EXISTS noticias_prod (
        idProd INT REFERENCES produtores(id) ON DELETE CASCADE, 
        idNoticia INT REFERENCES noticias(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idProd, idNoticia)
    );

    `


async function createTables() {
    try {
        const client = await pool.connect();
        await client.query(createTablesQueries);
        console.log('Tabelas criadas com sucesso!');
        client.release();
    } catch (err) {
        console.error('Erro ao criar tabelas:', err.message);
    } finally {
        await pool.end();}
}

createTables();

export default pool;