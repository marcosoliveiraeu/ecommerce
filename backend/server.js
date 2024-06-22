import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './Config/database.js';
import authRoutes from './Routes/authRoutes.js';
import userRoutes from './Routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware para parsear JSON e permitir CORS
app.use(express.json());
app.use(cors());

//rotas
app.use('/ecommerce', authRoutes);
app.use('/ecommerce', userRoutes);

// Rota simples de teste
app.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    res.json({ message: 'Servidor Node.js com PostgreSQL funcionando!', timestamp: result.rows[0].now });
    client.release();
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados', err);
    res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
  }
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
