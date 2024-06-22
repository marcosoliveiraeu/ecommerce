// routes/userRoutes.js
import express from 'express';
import UserController from '../Controllers/userController.js';
import { authenticateToken } from '../Middleware/authorization.js';

const router = express.Router();
const userController = new UserController();

// Endpoints de usuários
router.post('/users', authenticateToken, userController.createNewUser);
router.get('/users', authenticateToken, userController.listUsers);
router.get('/users/:id', authenticateToken, userController.getUser);
router.put('/users/:id', authenticateToken, userController.updateUser);
router.delete('/users/:id', authenticateToken, userController.deleteUser);

export default router;
