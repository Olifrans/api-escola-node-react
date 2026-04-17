const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite requisições do frontend
app.use(express.json());

// Dados em memória (substitua por PostgreSQL/MySQL/MongoDB em produção)
let alunos = [
  { id: 1, nome: 'Ana Silva', email: 'ana@email.com', curso: 'TI', matricula: '2023001' },
  { id: 2, nome: 'Bruno Costa', email: 'bruno@email.com', curso: 'Administração', matricula: '2023002' }
];
let nextId = 3;

// ROTAS
app.get('/api/alunos', (req, res) => res.json(alunos));

app.get('/api/alunos/:id', (req, res) => {
  const aluno = alunos.find(a => a.id == req.params.id);
  aluno ? res.json(aluno) : res.status(404).json({ erro: 'Aluno não encontrado' });
});

app.post('/api/alunos', (req, res) => {
  const { nome, email, curso, matricula } = req.body;
  if (!nome || !email) return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  
  const novo = { id: nextId++, nome, email, curso, matricula };
  alunos.push(novo);
  res.status(201).json(novo);
});

app.put('/api/alunos/:id', (req, res) => {
  const idx = alunos.findIndex(a => a.id == req.params.id);
  if (idx === -1) return res.status(404).json({ erro: 'Aluno não encontrado' });
  
  alunos[idx] = { ...alunos[idx], ...req.body, id: alunos[idx].id };
  res.json(alunos[idx]);
});

app.delete('/api/alunos/:id', (req, res) => {
  const idx = alunos.findIndex(a => a.id == req.params.id);
  if (idx === -1) return res.status(404).json({ erro: 'Aluno não encontrado' });
  
  alunos.splice(idx, 1);
  res.json({ mensagem: 'Aluno removido com sucesso' });
});

app.listen(PORT, () => console.log(`🟢 API rodando em http://localhost:${PORT}`));