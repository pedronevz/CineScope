import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cinescope',
    password: '12345678',
    port: 5432,
});

async function inserirFilmes(client) {
    try {
        // Lê a foto como um buffer
        const fotoCapa1 = fs.readFileSync('./images/JurorN2.jpeg');        
        const fotoCapa2 = fs.readFileSync('./images/LaLaLand.png');
        const fotoCapa3 = fs.readFileSync('./images/ToyStory.jpg');
        const fotoCapa4 = fs.readFileSync('./images/StarWarsIV.jpg');
        const fotoCapa5 = fs.readFileSync('./images/JanelaIndiscreta.png');

        const query = `
            INSERT INTO filmes (id, titulo, ano, sinopse, foto_capa, duracao, genero, diretor)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (titulo) DO NOTHING;
        `;

        // Valores dos parâmetros
        const filmes = [
            {
                id: 1, 
                titulo: 'Jurado Nº2', 
                ano: 2024,
                sinopse: 'Pai de família serve como jurado em um importante julgamento de assassinato. Ele se depara com um dilema moral significativo que pode influenciar o veredito do júri, potencialmente condenando ou absolvendo o réu acusado de homicídio.',
                foto_capa: fotoCapa1, // buffer
                duracao: '01:54:00', 
                genero: 1,
                diretor: 3
            },
            {
                id: 2, 
                titulo: 'La La Land: Cantando Estações', 
                ano: 2016,
                sinopse: 'O pianista Sebastian conhece a atriz Mia, e os dois se apaixonam perdidamente. Em busca de oportunidades para suas carreiras na competitiva Los Angeles, os jovens tentam fazer o relacionamento amoroso dar certo, enquanto perseguem fama e sucesso.',
                foto_capa: fotoCapa2, // buffer
                duracao: '02:08:00', 
                genero: 2,
                diretor: 5
            },
            {
                id: 3, 
                titulo: 'Toy Story', 
                ano: 1995,
                sinopse: 'O aniversário do garoto Andy está chegando e seus brinquedos ficam nervosos, temendo que ele ganhe novos brinquedos que possam substituí-los. Liderados pelo caubói Woody, o brinquedo predileto de Andy, eles recebem Buzz Lightyear, o boneco de um patrulheiro espacial, que logo passa a receber mais atenção do garoto. Com ciúmes, Woody tenta ensiná-lo uma lição, mas Buzz cai pela janela. É o início da aventura do caubói, que precisa resgatar Buzz para limpar sua barra com os outros brinquedos.',
                foto_capa: fotoCapa3, // buffer
                duracao: '01:21:00', 
                genero: 3,
                diretor: 4
            },
            {
                id: 4, 
                titulo: 'Star Wars: Episódio IV – Uma Nova Esperança', 
                ano: 1977,
                sinopse: 'A princesa Leia é mantida refém pelas forças imperiais comandadas por Darth Vader. Luke Skywalker e o capitão Han Solo precisam libertá-la e restaurar a liberdade e a justiça na galáxia.',
                foto_capa: fotoCapa4, // buffer
                duracao: '02:01:00', 
                genero: 4,
                diretor: 1
            },
            {
                id: 5, 
                titulo: 'Janela Indiscreta', 
                ano: 1954,
                sinopse: 'Em Greenwich Village, Nova York, L.B. Jeffries, um fotógrafo profissional, está confinado em seu apartamento por ter quebrado a perna enquanto trabalhava. Como não tem muitas opções de lazer, vasculha a vida dos seus vizinhos com um binóculo, quando vê alguns acontecimentos que o fazem suspeitar que um assassinato foi cometido.',
                foto_capa: fotoCapa5, // buffer
                duracao: '01:50:00', 
                genero: 5,
                diretor: 2
            }
        
        ];

        // Insere cada filme
        for (const filme of filmes) {
            const valores = [
                filme.id,
                filme.titulo,
                filme.ano,
                filme.sinopse,
                filme.foto_capa,
                filme.duracao,
                filme.genero,
                filme.diretor
            ];
            await client.query(query, valores);
            console.log(`Filme "${filme.titulo}" inserido com sucesso.`);
        }       
    } catch (err) {
        console.error('Erro ao inserir filme:', err.message);
        throw err;
    }
}

async function inserirDados() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

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
            INSERT INTO servicos_streaming (id, nome)
            VALUES
                (1, 'Max'),
                (2, 'Amazon Prime'),
                (3, 'Disney+'),
                (4, 'Netflix'),
                (5, 'Apple TV'),
                (6, 'Globoplay'),
                (7, 'Paramount+')
            ON CONFLICT (nome) DO NOTHING;
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
        
        await inserirFilmes(client);

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
                (2, 'Emma Stone', '1988-11-06'),  
                (3, 'Tom Hanks', '1956-07-09'),
                (4, 'Ryan Gosling', '1980-11-12'),
                (5, 'Toni Collette', '1972-11-01'),                
                (6, 'James Stewart', '1908-05-20'),
                (7, 'Mark Hamill', '1951-09-25'),
                (8, 'Carrie Fisher', '1956-10-21')             
            ON CONFLICT (nome) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO filmes_atores (idfilme, idator)
            VALUES
                (1, 1),
                (2, 2),
                (3, 3),
                (2, 4),
                (1, 5),
                (5, 6),
                (4, 7),
                (4, 8)
            ON CONFLICT (idfilme, idator) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO filmes_streaming (idfilme, idstreaming)
            VALUES
                (1, 1),
                (2, 2),
                (2, 5),
                (3, 3),
                (4, 3),
                (5, 2),
                (5, 5)
            ON CONFLICT (idfilme, idstreaming) DO NOTHING;
        `);

        await client.query('COMMIT');
        console.log('Dados iniciais inseridos com sucesso!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar tabelas ou inserir dados:', err.message);
    } finally {
        client.release();
        }
}

inserirDados();