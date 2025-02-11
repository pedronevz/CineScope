import express from 'express';
import {
    obterDiretorEFilmes
} from '../controllers/diretoresC.js';

const router = express.Router();

// Rotas
router.get('/:id', obterDiretorEFilmes);

export default router;