import express from 'express';
import {
    criarReview,
    obterReviewPorUsuario,
    obterReviewPorFilme,
    obterReviewFilmePorUsuario,
    atualizarReview,
    deletarReview
} from '../controllers/reviewsC.js';

const router = express.Router();

// Rotas
router.post('/', criarReview);
router.get('/filme/:idFilme/usuario/:idUsuario:id/:id2', obterReviewFilmePorUsuario);
router.get('/:idUsuario', obterReviewPorUsuario);
router.get('/:idFilme', obterReviewPorFilme);
router.put('/:id', atualizarReview);
router.delete('/:id', deletarReview);

export default router;