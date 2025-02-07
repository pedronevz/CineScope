import express from 'express';
import usuariosRouter from './routes/usuariosR.js';
import reviewsRouter from './routes/reviewsR.js';
import filmesRouter from './routes/filmesR.js';

const app = express();
const port = 3000;

app.use(express.json());

// Rotas
app.use('/usuarios', usuariosRouter);
app.use('/reviews', reviewsRouter);
app.use('/filmes', filmesRouter);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});