import express from 'express';
import {
    obterAtorPorId
} from '../controllers/atoresC.js';

const router = express.Router();

// Rotas
router.get('/:id', obterAtorPorId);

export default router;