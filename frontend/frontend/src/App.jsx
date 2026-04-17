import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  Clock, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Filter
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import './App.css';

const API_URL = 'http://localhost:3000/api/alunos';

// Cores para o gráfico
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

function App() {
  const [alunos, setAlunos] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', curso: '', matricula: '' });
  const [editId, setEditId] = useState(null);
  
  // Busca e Paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchAlunos();
    }
  };

  // Filtrar alunos pela busca
  const filteredAlunos = useMemo(() => {
    return alunos.filter(aluno => 
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [alunos, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredAlunos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlunos = filteredAlunos.slice(startIndex, endIndex);

  // Resetar para página 1 quando buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Dados para o gráfico
  const chartData = useMemo(() => {
    const cursos = {};
    alunos.forEach(aluno => {
      const curso = aluno.curso || 'Não informado';
      cursos[curso] = (cursos[curso] || 0) + 1;
    });
    
    return Object.entries(cursos).map(([name, value]) => ({
      name,
      value,
      fill: COLORS[Object.keys(cursos).indexOf(name) % COLORS.length]
    }));
  }, [alunos]);

  // Métricas
  const totalAlunos = alunos.length;
  const cursosUnicos = [...new Set(alunos.map(a => a.curso).filter(Boolean))].length;
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-title">
          <GraduationCap size={32} />
          <h1>API Escola</h1>
        </div>
        <span className="header-subtitle">
          <Clock size={16} />
          Painel de Gestão Acadêmica - {horaAtual}
        </span>
      </header>

      {/* Cards de Métricas */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total de Alunos</h3>
            <p>{totalAlunos}</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>Cursos Ativos</h3>
            <p>{cursosUnicos}</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>Média por Curso</h3>
            <p>{cursosUnicos > 0 ? (totalAlunos / cursosUnicos).toFixed(1) : 0}</p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="chart-section">
        <h2><BarChart3 size={20} /> Distribuição de Alunos por Curso</h2>
        <div className="chart-container">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} alunos`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              <BarChart3 size={48} />
              <p>Nenhum dado disponível para exibir o gráfico</p>
            </div>
          )}
        </div>
      </div>

      {/* Formulário */}
      <section className="form-section">
        <h2>
          {editId ? <Edit2 size={20} /> : <Plus size={20} />}
          {editId ? 'Editar Aluno' : 'Novo Cadastro'}
        </h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nome Completo</label>
            <input 
              placeholder="Ex: Maria Silva" 
              value={form.nome} 
              onChange={e => setForm({...form, nome: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Institucional</label>
            <input 
              placeholder="aluno@escola.com" 
              type="email" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Curso</label>
            <input 
              placeholder="Ex: Ciência da Computação" 
              value={form.curso} 
              onChange={e => setForm({...form, curso: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Matrícula</label>
            <input 
              placeholder="Ex: 20241001" 
              value={form.matricula} 
              onChange={e => setForm({...form, matricula: e.target.value})} 
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editId ? <Save size={18} /> : <Plus size={18} />}
              {editId ? 'Salvar' : 'Cadastrar'}
            </button>
            {editId && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => { setEditId(null); setForm({ nome: '', email: '', curso: '', matricula: '' }); }}
              >
                <X size={18} />
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Tabela com Busca e Paginação */}
      <section className="table-section">
        <div className="table-header">
          <h2><Users size={20} /> Lista de Alunos</h2>
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, email, curso ou matrícula..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="btn-clear" onClick={() => setSearchTerm('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

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
              {currentAlunos.map(a => (
                <tr key={a.id}>
                  <td className="cell-name">
                    <div className="avatar">
                      {a.nome.charAt(0).toUpperCase()}
                    </div>
                    <span>{a.nome}</span>
                  </td>
                  <td>{a.email}</td>
                  <td><span className="badge">{a.curso || 'N/A'}</span></td>
                  <td className="cell-matricula">{a.matricula || '-'}</td>
                  <td>
                    <span className="badge badge-active">
                      <span className="badge-dot"></span>
                      Ativo
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn-icon btn-edit" onClick={() => handleEdit(a)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(a.id)} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {currentAlunos.length === 0 && (
            <div className="empty-state">
              <Filter size={48} />
              <p>{searchTerm ? 'Nenhum aluno encontrado para esta busca.' : 'Nenhum aluno cadastrado ainda.'}</p>
              <span>{searchTerm ? 'Tente buscar com outros termos.' : 'Comece adicionando um novo registro acima.'}</span>
            </div>
          )}
        </div>

        {/* Paginação */}
        {filteredAlunos.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredAlunos.length)} de {filteredAlunos.length} alunos
            </div>
            <div className="pagination-controls">
              <button 
                className="btn-pagination" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`btn-page ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                className="btn-pagination" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;