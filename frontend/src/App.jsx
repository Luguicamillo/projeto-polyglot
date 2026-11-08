import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Books from './components/Books';
import Loans from './components/Loans';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', 'books', 'loans'
  const [loggedUser, setLoggedUser] = useState(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>Sistema de Biblioteca Digital</h1>
        <p style={{ color: '#aaa', fontSize: '1rem' }}>Polyglot Persistence Architecture (PostgreSQL + MongoDB + Redis)</p>
        
        {loggedUser && (
          <nav style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button 
              onClick={() => setCurrentPage('books')}
              style={{ padding: '8px 16px', background: currentPage === 'books' ? '#4f46e5' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Catálogo de Livros (MongoDB)
            </button>
            <button 
              onClick={() => setCurrentPage('loans')}
              style={{ padding: '8px 16px', background: currentPage === 'loans' ? '#4f46e5' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Gestão de Empréstimos (Redis)
            </button>
            <button 
              onClick={() => { setLoggedUser(null); setCurrentPage('login'); }}
              style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Sair ({loggedUser.nome || 'Conta'})
            </button>
          </nav>
        )}
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {currentPage === 'login' && (
          <Login 
            onLogin={(user) => { setLoggedUser(user); setCurrentPage('books'); }} 
            onSwitchToRegister={() => setCurrentPage('register')} 
          />
        )}

        {currentPage === 'register' && (
          <Register 
            onRegisterSuccess={() => {
              alert('Cadastro efetuado com sucesso! Por favor, faça login.');
              setCurrentPage('login'); // Redireciona para o login em vez de logar direto
            }} 
            onSwitchToLogin={() => setCurrentPage('login')} 
          />
        )}

        {currentPage === 'books' && <Books />}
        {currentPage === 'loans' && <Loans />}
      </main>

    </div>
  );
}

export default App;