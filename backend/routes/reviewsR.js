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
router.post('/filme/:idfilme/usuario/:idusuario', criarReview);
router.get('/filme/:idfilme/usuario/:idusuario', obterReviewFilmePorUsuario);
router.get('/usuario/:idusuario', obterReviewPorUsuario);
router.get('/filme/:idfilme', obterReviewPorFilme);
router.put('/:id', atualizarReview);
router.delete('/:id', deletarReview);

export default router;