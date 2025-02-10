import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'cinescope',
    password: '12345678', 
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
                descricao VARCHAR(100),
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
                url VARCHAR(100) NOT NULL, 
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

        await client.query(`
            CREATE TABLE IF NOT EXISTS users_listas (
                idLista INT REFERENCES listas(id) ON DELETE CASCADE,
                idUser INT REFERENCES usuarios(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (idLista, idUser)
            );
        `);

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

        // Insere dados iniciais
        await client.query(`
            INSERT INTO generos (id, nome)
            VALUES
                (1, 'Drama'),
                (2, 'Musical'),
                (3, 'Animação'),
                (4, 'Sci-Fi'),
                (5, 'Mistério')
            ON CONFLICT (nome) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO diretores (id, nome, data_nasc)
            VALUES
                (1, 'George Lucas', '1944-05-14'),
                (2, 'Alfred Hitchcock', '1899-08-13'),  
                (3, 'Clint Eastwood', '1930-05-31'),
                (4, 'John Lasseter', '1957-01-12'),
                (5, 'Damien Chazelle', '1985-01-19')             
            ON CONFLICT (nome) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO filmes (id, titulo, ano, sinopse, duracao, genero, diretor)
            VALUES
                (1, 'Jurado Nº2', 2024, 'Pai de família serve como jurado em um importante julgamento de assassinato. Ele se depara com um dilema moral significativo que pode influenciar o veredito do júri, potencialmente condenando ou absolvendo o réu acusado de homicídio.', '01:54:00', 1, 3),
                (2, 'La La Land: Cantando Estações', 2016, 'O pianista Sebastian conhece a atriz Mia, e os dois se apaixonam perdidamente. Em busca de oportunidades para suas carreiras na competitiva Los Angeles, os jovens tentam fazer o relacionamento amoroso dar certo, enquanto perseguem fama e sucesso.', '02:08:00', 2, 5),
                (3, 'Toy Story', 1995,  'O aniversário do garoto Andy está chegando e seus brinquedos ficam nervosos, temendo que ele ganhe novos brinquedos que possam substituí-los. Liderados pelo caubói Woody, o brinquedo predileto de Andy, eles recebem Buzz Lightyear, o boneco de um patrulheiro espacial, que logo passa a receber mais atenção do garoto. Com ciúmes, Woody tenta ensiná-lo uma lição, mas Buzz cai pela janela. É o início da aventura do caubói, que precisa resgatar Buzz para limpar sua barra com os outros brinquedos.', '01:21:00', 3, 4),
                (4, 'Star Wars: Episódio IV – Uma Nova Esperança', 1977, 'A princesa Leia é mantida refém pelas forças imperiais comandadas por Darth Vader. Luke Skywalker e o capitão Han Solo precisam libertá-la e restaurar a liberdade e a justiça na galáxia.', '02:01:00', 4, 1),
                (5, 'Janela Indiscreta', 1954, 'Em Greenwich Village, Nova York, L.B. Jeffries, um fotógrafo profissional, está confinado em seu apartamento por ter quebrado a perna enquanto trabalhava. Como não tem muitas opções de lazer, vasculha a vida dos seus vizinhos com um binóculo, quando vê alguns acontecimentos que o fazem suspeitar que um assassinato foi cometido.', '01:50:00', 5, 2)
            ON CONFLICT (titulo) DO NOTHING;
        `);
        
        await client.query(`
            INSERT INTO usuarios (id, nome, email, senha, data_nasc, bio)
            VALUES
                (1, 'John', 'John@hotimei.com', 'JHenrique', '1876-02-01', NULL),
                (2, 'Bernardette', 'Bernard@hotimei.com', 'atleticominasss', '2002-05-02', 'olá!'),
                (3, 'Gracie', 'GAbrams@gimei.com', 'sabrinaC.21', '2001-12-21', 'Hello Im Gracie Abrams, i like movies and music'),
                (4, 'Sofia', 'SODFAI@gimei.com', 'SIWA.@', '2002-10-31', 'BARBIE LEGAL')                
            ON CONFLICT (nome) DO NOTHING;
        `);
        
        await client.query(`
            INSERT INTO reviews (id, nota, texto, idfilme, idusuario)
            VALUES
                (1, 4.5, 'Gostei demais da janela, dos atores, da câmera, da luz, e do final!!! ele morre no final!!!', 5, 1),
                (2, 5, 'Coitado do Luke, mal sabe que quer matar seu próprio pai!', 4, 1),
                (3, 5, 'Gente, coitadinho do cervo :(', 1, 1),
                (4, 4, 'O MAIOR PILOTO DAS ESTRELAS. É DE FAMÍLIA', 4, 2),
                (5, 4.5, 'meu amigo, pense numa fofoca', 5, 4)
            ON CONFLICT (idfilme, idusuario) DO NOTHING;                
        `);

        await client.query(`
            INSERT INTO atores (id, nome, data_nasc)
            VALUES
                (1, 'Nicholas Hoult', '1989-12-07'),
                (2, 'Alfred Hitchcock', '1899-08-13'),  
                (3, 'Clint Eastwood', '1930-05-31'),
                (4, 'Ryan Gosling', '1980-11-12'),
                (5, 'Toni Collette', '1972-11-01')             
            ON CONFLICT (nome) DO NOTHING;
        `);

        await client.query('COMMIT');
        console.log('Tabelas criadas e dados iniciais inseridos com sucesso!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar tabelas ou inserir dados:', err.message);
    } finally {
        client.release();
    }
}

createTables();

export default pool;