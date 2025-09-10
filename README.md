# Vitalis - Gestor de Pedidos

Sistema de gestão de pedidos para farmácias, desenvolvido com React, TypeScript e integrado com backend Node.js.

## 🚀 Funcionalidades

- **Dashboard** - Visão geral das métricas da farmácia
- **Gestão de Pedidos** - Listagem, filtros, atualização de status
- **Catálogo de Produtos** - CRUD completo de produtos
- **Perfil da Farmácia** - Dados, estatísticas e avaliações
- **Sistema de Autenticação** - Login seguro com JWT
- **Interface Responsiva** - Funciona em desktop e mobile

## 🛠️ Tecnologias

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router DOM
- Axios
- Sonner (toasts)

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication
- Multer (uploads)
- Socket.io (WebSocket)

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- MySQL 8.0+
- Backend Vitalis rodando

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd Sistema-para-farmacias/Gestor-de-Pedidos
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Configure o backend
Certifique-se de que o backend está rodando:
```bash
cd ../backend
npm install
npm run dev
```

### 5. Execute o frontend
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:5173`

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── ...
├── contexts/           # Contextos React (Auth, etc.)
├── hooks/              # Custom hooks
├── layouts/            # Layouts da aplicação
├── lib/                # Utilitários e configurações
│   ├── api.ts          # Configuração da API
│   └── utils.ts        # Funções utilitárias
├── pages/              # Páginas da aplicação
└── types/              # Definições de tipos TypeScript
```

## 🔐 Autenticação

O sistema usa JWT para autenticação. O token é armazenado no localStorage e enviado automaticamente em todas as requisições.

### Tipos de Usuário
- **farmacia** - Acesso completo ao sistema
- **paciente** - Acesso limitado (não implementado no frontend)
- **medico** - Acesso médico (não implementado no frontend)
- **admin** - Acesso administrativo

## 📱 Páginas Principais

### Dashboard
- Métricas de vendas, prescrições, entregas
- Gráficos de performance
- Atividades recentes

### Pedidos
- Listagem com filtros
- Atualização de status
- Detalhes completos
- Cancelamento

### Produtos
- CRUD completo
- Upload de imagens
- Controle de estoque
- Descontos

### Farmácia
- Dados da empresa
- Estatísticas
- Avaliações de clientes
- Configurações

## 🔄 API Integration

O frontend se comunica com o backend através das seguintes rotas principais:

- `POST /api/auth/login` - Autenticação
- `GET /api/pedidos` - Listar pedidos
- `PUT /api/pedidos/:id/status` - Atualizar status
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto

## 🚀 Deploy

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview da build
- `npm run lint` - Executa o linter

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato através dos canais oficiais do projeto.
