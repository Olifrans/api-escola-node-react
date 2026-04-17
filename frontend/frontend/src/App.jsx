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

  return (
    <div className="container">
      <h1>🏫 API Escola - Gestão de Alunos</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="Curso" value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} />
        <input placeholder="Matrícula" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} />
        <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nome</th><th>Email</th><th>Curso</th><th>Matrícula</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map(a => (
            <tr key={a.id}>
              <td>{a.nome}</td>
              <td>{a.email}</td>
              <td>{a.curso}</td>
              <td>{a.matricula}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Editar</button>
                <button onClick={() => handleDelete(a.id)} style={{background: '#ff4d4d', color: '#fff', border: 'none'}}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;