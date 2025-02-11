import express from 'express';
import {
    criarLista,
    adicionarFilmeALista,
    removerFilmeDaLista,
    removerLista,
    editarLista,
    lerLista,
    lerListaPorId
} from '../controllers/listasC.js';

const router = express.Router();

// Rotas
router.post('/', criarLista); 
router.post('/adicionarFilme', adicionarFilmeALista);
router.delete('/:id', removerLista);  
router.delete('/:idLista/filmes/:idFilme', removerFilmeDaLista); 
router.put('/:id', editarLista); 
router.get('/:id', lerLista); 
router.get('/usuario/:idUsuario', lerListaPorId); // Adicionando a rota para ler listas por ID do usuário

export default router;
