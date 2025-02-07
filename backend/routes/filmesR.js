import express from 'express';
import {
    obterFilmes
} from '../controllers/filmesC.js';

const router = express.Router();

// Rotas
router.get('/', obterFilmes);

export default router;