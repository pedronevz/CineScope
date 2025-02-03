import express from 'express';
import {
    criarUsuario,
    obterUsuarios,
    obterUsuarioPorId,
    atualizarUsuario,
    deletarTodosUsuarios,
    deletarUsuario,
} from '../controllers/usuariosC.js';

const router = express.Router();

// Rotas
router.post('/', criarUsuario);
router.get('/', obterUsuarios);
router.get('/:id', obterUsuarioPorId);
router.put('/:id', atualizarUsuario);
router.delete('/', deletarTodosUsuarios);
router.delete('/:id', deletarUsuario);

export default router;