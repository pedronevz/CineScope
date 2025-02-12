import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cinescope',
    password: '12345678',
//    password: '0260902003',
    port: 5432,
});

async function dropTables() {
    const client = await pool.connect();
    try {
        
        await client.query(`
        DROP TABLE IF EXISTS noticias_diretores CASCADE;
        DROP TABLE IF EXISTS noticias_atores CASCADE;
        DROP TABLE IF EXISTS filmes_gen CASCADE;
        DROP TABLE IF EXISTS filmes_streaming CASCADE;
        DROP TABLE IF EXISTS noticias_filmes CASCADE;
        DROP TABLE IF EXISTS filmes_atores CASCADE;
        DROP TABLE IF EXISTS users_listas CASCADE;
        DROP TABLE IF EXISTS filmes_listas CASCADE;
        DROP TABLE IF EXISTS seguidores_usuarios CASCADE;
        DROP TABLE IF EXISTS servicos_streaming CASCADE;
        DROP TABLE IF EXISTS diretores CASCADE;
        DROP TABLE IF EXISTS noticias CASCADE;
        DROP TABLE IF EXISTS atores CASCADE;
        DROP TABLE IF EXISTS listas CASCADE;
        DROP TABLE IF EXISTS comentarios CASCADE;
        DROP TABLE IF EXISTS reviews CASCADE;
        DROP TABLE IF EXISTS filmes CASCADE;
        DROP TABLE IF EXISTS usuarios CASCADE;
        DROP TABLE IF EXISTS generos CASCADE;`);
        console.log('Todas as tabelas foram deletadas com sucesso!');
    } catch (err) {
        console.error('Erro ao deletar tabelas:', err.message);
    } finally {
        client.release();
    }
}

// Executa a função para deletar as tabelas
dropTables();