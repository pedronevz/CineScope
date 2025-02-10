import express from 'express';
import {
    criarLista,
    adicionarFilmeALista,
    removerFilmeDaLista,
    removerLista,
    editarLista,
    lerLista,
} from '../controllers/listasC.js';

const router = express.Router();

// Rotas
router.post('/', criarLista); 
router.post('/adicionarFilme', adicionarFilmeALista);
router.delete('/:id', removerLista);  
router.delete('/:idLista/filmes/:idFilme', removerFilmeDaLista); 
router.put('/:id', editarLista); 
router.get('/:id', lerLista); 

export default router;