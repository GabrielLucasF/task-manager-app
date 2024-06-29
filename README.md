# Task Management App

Este é um aplicativo de gerenciamento de tarefas desenvolvido com Laravel (backend) e Nuxt.js (frontend).

## Funcionalidades

- Autenticação de usuário (login, registro, logout).
- CRUD de tarefas (criar, editar, excluir, marcar como concluída).
- Atribuição de tarefas a usuários.
- Interface responsiva para desktop e dispositivos móveis.

## Tecnologias Utilizadas

- **Backend**: Laravel 11, JWT para autenticação.
- **Frontend**: Nuxt.js v3, Vue.js, Pinia para gerenciamento de estado.
- **Banco de Dados**: MySQL.
- **API**: Comunicação RESTful com endpoints para tarefas e usuários.

## Instalação

1. Clone o repositório
2. Instale as dependências do backend e frontend:
- Backend (Laravel):
  ```
  cd backend
  composer install
  cp .env.example .env
  php artisan key:generate
  php artisan migrate
  ```
- Frontend (Nuxt.js):
  ```
  cd frontend
  npm install
  ```

3. Configure as variáveis de ambiente:
- Backend (`.env`):
  ```
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=nome_do_banco
  DB_USERNAME=seu_usuario
  DB_PASSWORD=sua_senha
  ```
- Frontend (`frontend/nuxt.config.ts`):
  ```
  export default {
    public: {
      apiBase: 'http://localhost:8000/api' // URL da API Laravel
    }
  }
  ```

4. Inicie os servidores:
- Backend (Laravel):
  ```
  php artisan serve --port=8000
  ```
- Frontend (Nuxt.js):
  ```
  npm run dev
  ```

5. Acesse o aplicativo em `http://localhost:3000` no navegador.

## Contribuição

Sinta-se à vontade para contribuir com melhorias através de pull requests. Para problemas ou sugestões, abra uma issue.

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
