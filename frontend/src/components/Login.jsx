import { useState } from 'react';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const users = await response.json();
      
      // Procura o utilizador pelo nome cadastrado no PostgreSQL (coluna 'nome')
      const foundUser = users.find((u) => u.nome === name);

      if (foundUser) {
        alert('Login efetuado com sucesso!');
        onLogin(foundUser);
      } else {
        alert('Utilizador não encontrado. Por favor, cadastre-se.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao processar o login.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: '0 auto', background: '#1e1e1e', padding: '40px', borderRadius: '12px', border: '1px solid #333', boxSizing: 'border-box', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '8px' }}>Página de Login</h2>
      <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '0.95rem' }}>Entre com o seu utilizador e senha</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Utilizador" value={name} onChange={(e) => setName(e.target.value)} required
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
        />
        <input 
          type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
        />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '5px' }}>
          Entrar
        </button>
      </form>

      <button 
        onClick={onSwitchToRegister}
        style={{ background: 'transparent', border: 'none', color: '#60a5fa', marginTop: '20px', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
        Não tem conta? Ir para Cadastro
      </button>
    </div>
  );
}