# 💰 Fintech Mini Ledger - MVP

Projeto desenvolvido para a AC1 de Análise e Desenvolvimento de Sistemas (ADS). 
O sistema foca em controle financeiro para microempreendedores, integrando uma **Modern Data Stack** com performance e automação.

## 🚀 Tecnologias Utilizadas

### Backend
- **Java 17** com **Spring Boot 4**
- **Spring Data JPA** (Persistência)
- **PostgreSQL** (Banco de dados relacional)
- **REST API** com tratamento de concorrência e portas.

### Frontend
- **React + Vite** (TypeScript)
- **Tailwind CSS + shadcn/ui** (Interface responsiva)
- **Recharts** (Visualização de dados dinâmica)
- **Axios** (Consumo de API)

## 📊 Funcionalidades
- **Gestão de Terminais:** Cadastro e exclusão de maquininhas de cartão com validação de FK no banco.
- **Dashboard Financeiro:** Cards de saldo, vendas e taxas com lógica de cores para saúde financeira.
- **Fluxo de Caixa:** Gráfico interativo com filtros de período (7d, 30d, 6m, 1a).
- **Extrato:** Tabela de movimentações completa e responsiva para mobile.

## ⚙️ Como rodar o projeto
1. Certifique-se de ter o **PostgreSQL** rodando.
2. No diretório `backend`, execute `./mvnw spring-boot:run`.
3. No diretório `frontend`, execute `npm run dev`.
