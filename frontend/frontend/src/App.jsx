import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/api/alunos';

function App() {
  const [alunos, setAlunos] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', curso: '', matricula: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAlunos(); }, []);

  const fetchAlunos = async () => {
    try {
      const res = await axios.get(API_URL);
      setAlunos(res.data);
    } catch (err) {
      console.error('Erro ao buscar alunos', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ nome: '', email: '', curso: '', matricula: '' });
      setEditId(null);
      fetchAlunos();
    } catch (err) {
      console.error('Erro ao salvar', err);
    }
  };

  const handleEdit = (aluno) => {
    setForm({ nome: aluno.nome, email: aluno.email, curso: aluno.curso, matricula: aluno.matricula });
    setEditId(aluno.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchAlunos();
    }
  };

  // Métricas dinâmicas
  const totalAlunos = alunos.length;
  const cursosUnicos = [...new Set(alunos.map(a => a.curso).filter(Boolean))].length;
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🏫 API Escola</h1>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Painel de Gestão Acadêmica</span>
      </header>

      {/* Cards de Métricas */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Alunos</h3>
          <p>{totalAlunos}</p>
        </div>
        <div className="stat-card">
          <h3>Cursos Ativos</h3>
          <p>{cursosUnicos}</p>
        </div>
        <div className="stat-card">
          <h3>Última Atualização</h3>
          <p>{horaAtual}</p>
        </div>
      </div>

      {/* Formulário */}
      <section className="form-section">
        <h2>{editId ? '✏️ Editar Aluno' : '➕ Novo Cadastro'}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nome Completo</label>
            <input placeholder="Ex: Maria Silva" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email Institucional</label>
            <input placeholder="aluno@escola.com" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Curso</label>
            <input placeholder="Ex: Ciência da Computação" value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Matrícula</label>
            <input placeholder="Ex: 20241001" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: 'fit-content' }}>
            {editId ? 'Salvar Alterações' : 'Cadastrar Aluno'}
          </button>
          {editId && (
            <button type="button" className="btn btn-secondary" style={{ height: 'fit-content' }} onClick={() => { setEditId(null); setForm({ nome: '', email: '', curso: '', matricula: '' }); }}>
              Cancelar
            </button>
          )}
        </form>
      </section>

      {/* Tabela */}
      <section className="table-section">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Curso</th>
                <th>Matrícula</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.nome}</td>
                  <td>{a.email}</td>
                  <td><span className="badge">{a.curso || 'N/A'}</span></td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{a.matricula || '-'}</td>
                  <td><span className="badge" style={{ background: '#d1fae5', color: '#059669' }}>Ativo</span></td>
                  <td className="actions">
                    <button className="btn btn-secondary" onClick={() => handleEdit(a)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(a.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {alunos.length === 0 && (
            <div className="empty-state">Nenhum aluno cadastrado ainda. Comece adicionando um novo registro.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;