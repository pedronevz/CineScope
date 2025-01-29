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
        ano DATE NOT NULL,
        nota_media DECIMAL NOT NULL,
        sinopse VARCHAR(1000) NOT NULL,
        foto_capa TEXT,
        duracao TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        nota DECIMAL NOT NULL,
        idFilme SERIAL REFERENCES filmes(id) ON DELETE CASCADE,
        idUsuario SERIAL REFERENCES usuarios(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comentarios (
        id SERIAL PRIMARY KEY,
        texto VARCHAR(1000) NOT NULL,
        idUsuario SERIAL REFERENCES usuarios(id) ON DELETE CASCADE,
        idReview SERIAL REFERENCES reviews(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS listas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL, 
        descrição VARCHAR(100),
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