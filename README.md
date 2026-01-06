# Blogging Mobile - React Native

Aplicação mobile desenvolvida em React Native para gerenciamento de posts, professores e estudantes, integrada com a API REST do backend.

## 📋 Requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Backend rodando na porta 3002

## 🚀 Instalação

1. Instale as dependências:

```bash
npm install
```

ou

```bash
yarn install
```

2. Configure a URL da API no arquivo `src/config/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3002';
```

Para dispositivos físicos, substitua `localhost` pelo IP da sua máquina na rede local.

3. Inicie o servidor Expo:

```bash
npm start
```

ou

```bash
yarn start
```

## 📱 Executando a Aplicação

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Web

```bash
npm run web
```

## 🏗️ Arquitetura

### Estrutura de Pastas

```
mobile/
├── src/
│   ├── config/          # Configurações (API base URL)
│   ├── contexts/        # Context API (AuthContext)
│   ├── navigation/      # Configuração de navegação
│   ├── screens/         # Telas da aplicação
│   └── services/        # Serviços de API
├── App.js              # Componente principal
├── app.json            # Configuração do Expo
└── package.json        # Dependências do projeto
```

### Navegação

A aplicação utiliza React Navigation com:
- **Stack Navigator**: Para navegação hierárquica entre telas
- **Bottom Tab Navigator**: Para navegação principal (apenas para professores)

### Autenticação

O sistema de autenticação utiliza Context API para gerenciar o estado do usuário:
- Login de professores e estudantes
- Armazenamento de token e dados do usuário no AsyncStorage
- Verificação de permissões baseada no tipo de usuário

### Permissões

- **Professores**: Acesso completo (criar, editar, excluir posts, gerenciar professores e estudantes)
- **Estudantes**: Apenas visualização de posts

## 📄 Funcionalidades

### 1. Página Principal (Lista de Posts)
- Exibe todos os posts disponíveis
- Busca por palavras-chave
- Pull-to-refresh
- Botão para criar post (apenas professores)

### 2. Página de Leitura de Post
- Exibe conteúdo completo do post
- Opções de editar e excluir (apenas professores)

### 3. Página de Criação/Edição de Posts
- Formulário com título, autor e conteúdo
- Validação de campos obrigatórios

### 4. Página Administrativa
- Lista todos os posts com opções de editar e excluir
- Acesso restrito a professores

### 5. Gerenciamento de Professores
- Listagem paginada
- Criação de novos professores
- Edição de professores existentes
- Exclusão de professores

### 6. Gerenciamento de Estudantes
- Listagem paginada
- Criação de novos estudantes
- Edição de estudantes existentes
- Exclusão de estudantes

## 🔌 Integração com Backend

A aplicação consome os seguintes endpoints:

### Autenticação
- `POST /v1/auth/login` - Login

### Posts
- `GET /v1/posts` - Listar todos os posts
- `GET /v1/posts/:id` - Obter post por ID
- `POST /v1/posts` - Criar post (apenas professores)
- `PUT /v1/posts/:id` - Atualizar post (apenas professores)
- `DELETE /v1/posts/:id` - Excluir post (apenas professores)
- `GET /v1/posts/search` - Buscar posts

### Professores
- `GET /v1/teachers` - Listar professores (paginado)
- `GET /v1/teachers/:id` - Obter professor por ID
- `POST /v1/teachers` - Criar professor
- `PUT /v1/teachers/:id` - Atualizar professor
- `DELETE /v1/teachers/:id` - Excluir professor

### Estudantes
- `GET /v1/students` - Listar estudantes (paginado)
- `GET /v1/students/:id` - Obter estudante por ID
- `POST /v1/students` - Criar estudante
- `PUT /v1/students/:id` - Atualizar estudante
- `DELETE /v1/students/:id` - Excluir estudante

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma para desenvolvimento React Native
- **React Navigation**: Navegação entre telas
- **Axios**: Cliente HTTP para requisições à API
- **AsyncStorage**: Armazenamento local de dados
- **Context API**: Gerenciamento de estado global

## 📝 Notas de Desenvolvimento

- A aplicação utiliza hooks e componentes funcionais
- O estado é gerenciado principalmente através de Context API
- Todas as requisições incluem o token de autenticação automaticamente
- A navegação é condicional baseada no tipo de usuário (professor/estudante)

## 🔒 Segurança

- Tokens JWT são armazenados no AsyncStorage
- Requisições autenticadas incluem o token no header Authorization
- Validação de permissões no frontend e backend
- Senhas não são armazenadas em texto plano

## 📱 Compatibilidade

- Android 5.0+
- iOS 11.0+
- Web (via Expo)

