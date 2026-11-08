import { useState, useEffect } from 'react';

export default function Books() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [booksList, setBooksList] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch('http://localhost:5000/api/books');
        const data = await res.json();
        setBooksList(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envia usando as chaves em português para alinhar com o MongoDB
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor, isbn })
      });
      if (response.ok) {
        alert('Livro cadastrado com sucesso no MongoDB!');
        setTitulo('');
        setAutor('');
        setIsbn('');
        
        const res = await fetch('http://localhost:5000/api/books');
        const data = await res.json();
        setBooksList(data);
      } else {
        alert('Erro ao cadastrar livro.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '650px', margin: '0 auto', background: '#1e1e1e', padding: '40px', borderRadius: '12px', border: '1px solid #333', boxSizing: 'border-box' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>2. Catálogo de Livros (MongoDB)</h2>
      <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '0.95rem', textAlign: 'center' }}>Adicione e consulte livros com estrutura flexível de documentos.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '35px' }}>
        <input 
          type="text" placeholder="Título do Livro" value={titulo} onChange={(e) => setTitulo(e.target.value)} required
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
        />
        <input 
          type="text" placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} required
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
        />
        <input 
          type="text" placeholder="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} required
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
        />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '5px' }}>
          Cadastrar Livro
        </button>
      </form>

      <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Livros Disponíveis no Acervo:</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {booksList.map((book, index) => (
          <li key={index} style={{ background: '#2a2a2a', padding: '15px', borderRadius: '6px', border: '1px solid #333' }}>
            <strong style={{ color: '#fff', fontSize: '1.05rem' }}>{book.titulo || book.title}</strong> 
            <div style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '4px' }}>
              Autor: {book.autor || book.author} — <span style={{ color: '#888' }}>ISBN: {book.isbn}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}