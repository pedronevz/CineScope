import express from 'express';
import {
    obterFilmes,
    obterFilmeDetalhado
} from '../controllers/filmesC.js';

const router = express.Router();

// Rotas
router.get('/', obterFilmes);
router.get('/:id', obterFilmeDetalhado);

export default router;