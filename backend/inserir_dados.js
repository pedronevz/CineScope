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

async function inserirFilmes(client) {
    try {
        // Lê a foto como um buffer
        const fotoCapa1 = fs.readFileSync('./images/JurorN2.jpeg');        
        const fotoCapa2 = fs.readFileSync('./images/LaLaLand.png');
        const fotoCapa3 = fs.readFileSync('./images/ToyStory.jpg');
        const fotoCapa4 = fs.readFileSync('./images/StarWarsIV.jpg');
        const fotoCapa5 = fs.readFileSync('./images/JanelaIndiscreta.png');

        const query = `
            INSERT INTO filmes (id, titulo, ano, nota_media, sinopse, foto_capa, duracao, genero, diretor)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (titulo) DO NOTHING;
        `;

        // Valores dos parâmetros
        const filmes = [
            {
                id: 91, 
                titulo: 'Jurado Nº2', 
                ano: 2024,
                nota_media: 5,
                sinopse: 'Pai de família serve como jurado em um importante julgamento de assassinato. Ele se depara com um dilema moral significativo que pode influenciar o veredito do júri, potencialmente condenando ou absolvendo o réu acusado de homicídio.',
                foto_capa: fotoCapa1, // buffer
                duracao: '01:54:00', 
                genero: 91,
                diretor: 93
            },
            {
                id: 92, 
                titulo: 'La La Land: Cantando Estações', 
                ano: 2016,
                nota_media: null,
                sinopse: 'O pianista Sebastian conhece a atriz Mia, e os dois se apaixonam perdidamente. Em busca de oportunidades para suas carreiras na competitiva Los Angeles, os jovens tentam fazer o relacionamento amoroso dar certo, enquanto perseguem fama e sucesso.',
                foto_capa: fotoCapa2, // buffer
                duracao: '02:08:00', 
                genero: 92,
                diretor: 95
            },
            {
                id: 93, 
                titulo: 'Toy Story', 
                ano: 1995,
                nota_media: null,
                sinopse: 'O aniversário do garoto Andy está chegando e seus brinquedos ficam nervosos, temendo que ele ganhe novos brinquedos que possam substituí-los. Liderados pelo caubói Woody, o brinquedo predileto de Andy, eles recebem Buzz Lightyear, o boneco de um patrulheiro espacial, que logo passa a receber mais atenção do garoto. Com ciúmes, Woody tenta ensiná-lo uma lição, mas Buzz cai pela janela. É o início da aventura do caubói, que precisa resgatar Buzz para limpar sua barra com os outros brinquedos.',
                foto_capa: fotoCapa3, // buffer
                duracao: '01:21:00', 
                genero: 93,
                diretor: 94
            },
            {
                id: 94, 
                titulo: 'Star Wars: Episódio IV – Uma Nova Esperança', 
                ano: 1977,
                nota_media: 4.5,
                sinopse: 'A princesa Leia é mantida refém pelas forças imperiais comandadas por Darth Vader. Luke Skywalker e o capitão Han Solo precisam libertá-la e restaurar a liberdade e a justiça na galáxia.',
                foto_capa: fotoCapa4, // buffer
                duracao: '02:01:00', 
                genero: 94,
                diretor: 91
            },
            {
                id: 95, 
                titulo: 'Janela Indiscreta', 
                ano: 1954,
                nota_media: 4.5,
                sinopse: 'Em Greenwich Village, Nova York, L.B. Jeffries, um fotógrafo profissional, está confinado em seu apartamento por ter quebrado a perna enquanto trabalhava. Como não tem muitas opções de lazer, vasculha a vida dos seus vizinhos com um binóculo, quando vê alguns acontecimentos que o fazem suspeitar que um assassinato foi cometido.',
                foto_capa: fotoCapa5, // buffer
                duracao: '01:50:00', 
                genero: 95,
                diretor: 92
            }
        
        ];

        // Insere cada filme
        for (const filme of filmes) {
            const valores = [
                filme.id,
                filme.titulo,
                filme.ano,
                filme.nota_media,
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
                (91, 'Drama'),
                (92, 'Musical'),
                (93, 'Animação'),
                (94, 'Sci-Fi'),
                (95, 'Mistério')
            ON CONFLICT (nome) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO diretores (id, nome, data_nasc)
            VALUES
                (91, 'George Lucas', '1944-05-14'),
                (92, 'Alfred Hitchcock', '1899-08-13'),  
                (93, 'Clint Eastwood', '1930-05-31'),
                (94, 'John Lasseter', '1957-01-12'),
                (95, 'Damien Chazelle', '1985-01-19')             
            ON CONFLICT (nome) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO servicos_streaming (id, nome)
            VALUES
                (91, 'Max'),
                (92, 'Amazon Prime'),
                (93, 'Disney+'),
                (94, 'Netflix'),
                (95, 'Apple TV'),
                (96, 'Globoplay'),
                (97, 'Paramount+')
            ON CONFLICT (nome) DO NOTHING;
        `);
        
        await client.query(`
            INSERT INTO noticias (id, titulo, conteudo)
            VALUES
                (101, 'Noticia1', 'Isso é uma notícia'),
                (102, 'Indicados ao Oscar', 'Filmes foram indicados'),
                (103, 'Filme sobre palíndromos', 'somordnílap erbos emliF'),
                (104, 'Noticia2', 'Isso é uma notícia2'),
                (105, 'Streamings ou cinema', 'A pergunta do século XXI: Serviços de streaming o sinema?')
            ON CONFLICT (id) DO NOTHING;
        `);
        
        await client.query(`
            INSERT INTO noticias_diretores (idProd, idNoticia)
            VALUES
                (91, 101),
                (92, 102),
                (93, 103),
                (94, 104),
                (95, 105)
            ON CONFLICT (idProd, idNoticia) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO usuarios (id, nome, email, senha, data_nasc, bio)
            VALUES
                (91, 'John', 'John@hotimei.com', 'JHenrique', '1876-02-01', NULL),
                (92, 'Bernardette', 'Bernard@hotimei.com', 'atleticominasss', '2002-05-02', 'olá!'),
                (93, 'Gracie', 'GAbrams@gimei.com', 'sabrinaC.21', '2001-12-21', 'Hello Im Gracie Abrams, i like movies and music'),
                (94, 'Sofia', 'SODFAI@gimei.com', 'SIWA.@', '2002-10-31', 'BARBIE LEGAL')                
            ON CONFLICT (nome) DO NOTHING;
        `);
        
        await inserirFilmes(client);

        await client.query(`
            INSERT INTO reviews (id, nota, texto, idfilme, idusuario)
            VALUES
                (91, 4.5, 'Gostei demais da janela, dos atores, da câmera, da luz, e do final!!! ele morre no final!!!', 95, 91),
                (92, 5, 'Coitado do Luke, mal sabe que quer matar seu próprio pai!', 94, 91),
                (93, 5, 'Gente, coitadinho do cervo :(', 91, 91),
                (94, 4, 'O MAIOR PILOTO DAS ESTRELAS. É DE FAMÍLIA', 94, 92),
                (95, 4.5, 'meu amigo, pense numa fofoca', 95, 94)
            ON CONFLICT (idfilme, idusuario) DO NOTHING;      
        `);

        await client.query(`
            INSERT INTO atores (id, nome, data_nasc)
            VALUES
                (91, 'Nicholas Hoult', '1989-12-07'),
                (92, 'Emma Stone', '1988-11-06'),  
                (93, 'Tom Hanks', '1956-07-09'),
                (94, 'Ryan Gosling', '1980-11-12'),
                (95, 'Toni Collette', '1972-11-01'),                
                (96, 'James Stewart', '1908-05-20'),
                (97, 'Mark Hamill', '1951-09-25'),
                (98, 'Carrie Fisher', '1956-10-21')             
            ON CONFLICT (nome) DO NOTHING;
        `);
        
        await client.query(`
            INSERT INTO noticias_atores (idAtor, idNoticia)
            VALUES
                (91, 101),
                (92, 102),
                (93, 103),
                (94, 104),
                (95, 105)
            ON CONFLICT (idAtor, idNoticia) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO filmes_atores (idfilme, idator)
            VALUES
                (91, 91),
                (92, 92),
                (93, 93),
                (92, 94),
                (91, 95),
                (95, 96),
                (94, 97),
                (94, 98)
            ON CONFLICT (idfilme, idator) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO filmes_streaming (idfilme, idstreaming)
            VALUES
                (91, 91),
                (92, 92),
                (92, 95),
                (93, 93),
                (94, 93),
                (95, 92),
                (95, 95)
            ON CONFLICT (idfilme, idstreaming) DO NOTHING;
        `);
        
        await client.query(`
            INSERT INTO listas (id, nome, idusuario)
            VALUES
                (101, 'Filmes de Ficção Científica', '93'),
                (102, 'Clássicos do Cinema', '92'),
                (103, 'Filmes para Chorar', '94'),
                (104, 'Filmes de Ação', '93'),
                (105, 'Filmes de Comédia', '91')
            ON CONFLICT (id) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO comentarios (id, texto, idUsuario, idReview)
            VALUES
                (101, 'Concordo plenamente com a review!', 91, 91),
                (102, 'O final foi realmente surpreendente!', 92, 92),
                (103, 'Adorei a análise sobre a fotografia.', 93, 93),
                (104, 'O Luke é realmente um personagem incrível.', 94, 94),
                (105, 'O cervo é o verdadeiro protagonista!', 91, 95)
            ON CONFLICT (id) DO NOTHING;
        `);
        
        await client.query(`
            INSERT INTO seguidores_usuarios (idSeguidor, idSeguido)
            VALUES
                (91, 92),
                (92, 93),
                (93, 94),
                (94, 91),
                (92, 91)
            ON CONFLICT (idSeguidor, idSeguido) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO filmes_listas (idLista, idFilme)
            VALUES
                (101, 91),
                (101, 94),
                (102, 95),
                (103, 92),
                (104, 93)
            ON CONFLICT (idLista, idFilme) DO NOTHING;
        `);

        await client.query(`
            INSERT INTO noticias_filmes (idFilme, idNoticia)
            VALUES
                (91, 101),
                (92, 102),
                (93, 103),
                (94, 104),
                (95, 105)
            ON CONFLICT (idFilme, idNoticia) DO NOTHING;
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