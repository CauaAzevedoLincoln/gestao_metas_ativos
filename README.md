# 🎯 Sistema de Gestão de Metas

Sistema standalone de controle e acompanhamento de metas por analista, desenvolvido com **Next.js 14**, **Prisma ORM** e **SQLite**.

---

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: SQLite (via Prisma + LibSQL)
- **Estilização**: Tailwind CSS
- **Gráficos**: Chart.js + react-chartjs-2
- **Formulários**: React Hook Form

---

## ⚙️ Configuração Local

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
O arquivo `.env` já vem configurado para SQLite local. Nenhuma alteração é necessária para rodar localmente.

### 4. Crie o banco de dados e aplique as migrations
```bash
npm run db:setup
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy na Vercel

### Pré-requisito: Banco de dados em produção

Para produção, o projeto utiliza o **[Neon PostgreSQL](https://neon.tech)** (banco gerenciado, plano gratuito disponível):

1. Crie uma conta no [Neon](https://neon.tech)
2. Crie um novo projeto e obtenha a **Connection String**.
3. No Neon, selecione **Connection Details** e copie a URL.

### Variáveis de ambiente na Vercel

No painel da Vercel → Settings → Environment Variables, adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://usuario:senha@ep-xxx-pooler.regiao.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | `postgresql://usuario:senha@ep-xxx.regiao.neon.tech/neondb?sslmode=require` |

*Nota: A `DIRECT_URL` é a mesma conexão do Neon mas SEM o `-pooler` no hostname, necessária para o Prisma Migrate.*

### Deploy

```bash
# Via CLI da Vercel
npx vercel --prod

# Ou conecte o repositório GitHub diretamente no painel da Vercel
```

---

## 📁 Estrutura do Projeto

```
sistema-metas-talita/
├── app/
│   ├── actions.ts       # Server Actions (CRUD de metas)
│   ├── globals.css      # Estilos globais
│   ├── layout.tsx       # Layout raiz
│   ├── page.tsx         # Página principal
│   └── lib/
│       └── prisma.ts    # Cliente Prisma singleton
├── prisma/
│   ├── schema.prisma    # Schema do banco de dados
│   └── migrations/      # Histórico de migrations
├── .env.example         # Template de variáveis de ambiente
├── package.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## 📊 Funcionalidades

- ✅ Cadastro de metas por analista, mês, semana e atividade
- ✅ Registro de valores realizados vs. meta
- ✅ Dashboard com gráficos de desempenho
- ✅ Filtros por analista e período
- ✅ Exclusão de registros
- ✅ Indicadores de status (Atingido / Parcial / Não Atingido)
