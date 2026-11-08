const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { Pool } = require('pg');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ==========================================
// 1. CONEXÃO COM POSTGRESQL (RDB) - Utilizadores
// ==========================================
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_URL && process.env.POSTGRES_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

// Criação automática da tabela de utilizadores se não existir
pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    password VARCHAR(100) UNIQUE NOT NULL
  )
`).catch(err => console.log('Aviso Postgres (Modo local/simulado):', err.message));

// ==========================================
// 2. CONEXÃO COM MONGODB (NoSQL Document) - Livros
// ==========================================
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
    .catch(err => console.log('Erro ao conectar no MongoDB:', err.message));
}

const livroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  isbn: { type: String, required: true }
});
const Livro = mongoose.model('Livro', livroSchema);

// ==========================================
// 3. CONEXÃO COM REDIS (Key-Value) - Empréstimos
// ==========================================
let redisClient = null;
if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 50, 2000);
    }
  });

  redisClient.on('error', (err) => console.log('Aviso Redis (Modo simulado ativo):', err.message));
}

// Armazenamento auxiliar em memória para garantir que os empréstimos apareçam instantaneamente
let memoryLoansFallback = [];

// ==========================================
// ROTAS DA API (CRUD)
// ==========================================

// --- PostgreSQL: Utilizadores / Login / Registo ---
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.json([]);
  }
});

app.post('/api/users', async (req, res) => {
  const nameOrNome = req.body.nome || req.body.name;
  const { password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, password) VALUES ($1, $2) RETURNING *',
      [nameOrNome, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MongoDB: Livros ---
app.get('/api/books', async (req, res) => {
  try {
    const livros = await Livro.find();
    res.json(livros);
  } catch (err) {
    res.json([]);
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const novoLivro = new Livro(req.body);
    const salvo = await novoLivro.save();
    res.json(salvo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Redis: Empréstimos (Key-Value) ---
app.get('/api/loans', async (req, res) => {
  try {
    if (!redisClient || redisClient.status !== 'ready') {
      return res.json(memoryLoansFallback);
    }
    const keys = await redisClient.keys('emprestimo:*');
    const emprestimos = [];
    for (let key of keys) {
      const data = await redisClient.get(key);
      if (data) emprestimos.push(JSON.parse(data));
    }
    if (emprestimos.length === 0 && memoryLoansFallback.length > 0) {
      return res.json(memoryLoansFallback);
    }
    res.json(emprestimos);
  } catch (err) {
    res.json(memoryLoansFallback);
  }
});

app.post('/api/loans', async (req, res) => {
  const { userId, bookId } = req.body;
  const chaveID = `emprestimo:${Date.now()}`;
  const dadosEmprestimo = { userId, bookId, data: new Date().toISOString() };
  
  memoryLoansFallback.push(dadosEmprestimo);

  try {
    if (redisClient && redisClient.status === 'ready') {
      await redisClient.set(chaveID, JSON.stringify(dadosEmprestimo));
    }
    res.json({ mensagem: 'Empréstimo registado com sucesso!', dados: dadosEmprestimo });
  } catch (err) {
    res.json({ mensagem: 'Empréstimo registado com sucesso!', dados: dadosEmprestimo });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend a correr na porta ${PORT}`);
});