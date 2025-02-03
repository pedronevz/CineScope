import express from 'express';
import usuariosRouter from './routes/usuariosR.js';

const app = express();
const port = 3000;

app.use(express.json());

// Rotas
app.use('/usuarios', usuariosRouter);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});