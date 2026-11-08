import { useState, useEffect } from 'react';

export default function Loans() {
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [loansList, setLoansList] = useState([]);

  // Função para carregar os empréstimos ativos do Redis (definida de forma reutilizável)
  const loadLoans = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/loans');
      const data = await res.json();
      setLoansList(data);
    } catch (err) {
      console.error('Erro ao carregar empréstimos:', err);
    }
  };

  // Usando função assíncrona interna para evitar o aviso do linter do React
  useEffect(() => {
    async function fetchInitialLoans() {
      await loadLoans();
    }
    fetchInitialLoans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, bookId })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Empréstimo registado no Redis com sucesso!');
        setUserId('');
        setBookId('');
        // Atualiza a lista imediatamente após o registo bem-sucedido
        await loadLoans();
      } else {
        alert('Erro ao registar empréstimo: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o backend.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '650px', margin: '0 auto', background: '#1e1e1e', padding: '40px', borderRadius: '12px', border: '1px solid #333', boxSizing: 'border-box' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>3. Gestão de Empréstimos Ativos (Redis)</h2>
      <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '0.95rem', textAlign: 'center' }}>Registe sessões rápidas de empréstimo chave-valor.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '35px' }}>
        <input 
          type="text" placeholder="Nome do Utilizador (ex: Luis)" value={userId} onChange={(e) => setUserId(e.target.value)} required
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
        />
        <input 
          type="text" placeholder="Título do Livro" value={bookId} onChange={(e) => setBookId(e.target.value)} required
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
        />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '5px' }}>
          Registar Empréstimo
        </button>
      </form>

      <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Empréstimos Ativos:</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loansList.length === 0 ? (
          <p style={{ color: '#777', fontSize: '0.9rem', textAlign: 'center' }}>Nenhum empréstimo registado no momento.</p>
        ) : (
          loansList.map((loan, index) => (
            <li key={index} style={{ background: '#2a2a2a', padding: '15px', borderRadius: '6px', border: '1px solid #333' }}>
              <strong style={{ color: '#fbbf24' }}>Utilizador: {loan.userId || loan.usuarioId}</strong> 
              <div style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '4px' }}>
                Livro: {loan.bookId || loan.livroId} — <span style={{ color: '#888' }}>Data: {new Date(loan.data).toLocaleString()}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}