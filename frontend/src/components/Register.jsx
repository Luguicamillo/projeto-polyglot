import { useState } from 'react';

export default function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Utilizador cadastrado com sucesso no PostgreSQL!');
        if (onRegisterSuccess) onRegisterSuccess(data);
      } else {
        alert('Erro: ' + (data.error || 'Não foi possível cadastrar'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o backend.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: '0 auto', background: '#1e1e1e', padding: '40px', borderRadius: '12px', border: '1px solid #333', boxSizing: 'border-box', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '8px' }}>Página de Cadastro</h2>
      <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '0.95rem' }}>Crie uma nova conta (PostgreSQL)</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Utilizador" value={name} onChange={(e) => setName(e.target.value)} required
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
        />
        <input 
          type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
        />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '5px' }}>
          Registar Conta
        </button>
      </form>

      <button 
        onClick={onSwitchToLogin}
        style={{ background: 'transparent', border: 'none', color: '#60a5fa', marginTop: '20px', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
        Já tem uma conta? Faça login
      </button>
    </div>
  );
}