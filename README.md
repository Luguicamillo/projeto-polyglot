# 📚 Sistema de Biblioteca Digital (Arquitetura de Persistência Poliglota)

Aplicação web desenvolvida no âmbito acadêmico para demonstrar a utilização integrada de **múltiplos modelos de bases de dados (Persistência Poliglota)**, combinando bases relacionais, NoSQL orientadas a documentos e armazenamento em memória/chave-valor.

---

## 🚀 Tecnologias Utilizadas

O ecossistema do projeto está divido entre Frontend e Backend:

* **Frontend:** React, Vite, CSS moderno.
* **Backend:** Node.js, Express, CORS, Dotenv.
* **Bases de Dados (Polyglot Persistence):**
  1. **PostgreSQL (Neon.tech):** Relacional (RDB) — Utilizado para a gestão de autenticação, registo e tabela de utilizadores (`usuarios`).
  2. **MongoDB (Atlas):** NoSQL orientado a documentos — Utilizado para o catálogo flexível de livros (`Livros`: título, autor, ISBN).
  3. **Redis (ioredis):** Chave-Valor em memória — Utilizado para o registo e gestão rápida de sessões de empréstimos ativos (`emprestimo:*`) com mecanismo robusto de fallback.

---

## ⚙️ Pré-requisitos

Certifica-te de que tens instalado no teu computador:
* **Node.js** (versão 18 ou superior recomendada)
* **npm** ou **yarn**

---

## 📦 Como Instalar e Executar o Projeto

### 1. Clonar o repositório
```bash
git clone [https://github.com/Luguicamillo/projeto-polyglot.git](https://github.com/Luguicamillo/projeto-polyglot.git)
cd projeto-polyglot