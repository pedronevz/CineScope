import express from 'express';
import {
    criarLista,
    adicionarFilmeALista,
    removerFilmeDaLista,
    removerLista,
    editarLista,
    editarFilmes,
    lerLista,
    lerListaPorId,
    obterFilmesDaLista
} from '../controllers/listasC.js';

const router = express.Router();

// Rotas
router.post('/', criarLista); 
router.post('/adicionarFilme', adicionarFilmeALista);
router.delete('/:id', removerLista);  
router.delete('/:idLista/filmes/:idFilme', removerFilmeDaLista); 
router.put('/:id', editarLista);
router.put('/:id/editarFilmes', editarFilmes); 
router.get('/:id', lerLista); 
router.get('/usuario/:idUsuario', lerListaPorId);
router.get('/:id/filmes', obterFilmesDaLista);

export default router;
