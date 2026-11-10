# Task Manager App

Interface web de estudo para gerenciamento de tarefas. Usa Nuxt 3, Vue.js, Pinia e Axios para consumir a [Task Manager API em Laravel](https://github.com/GabrielLucasF/task-manager-api).

## O que explorar

- Cadastro e login pela interface.
- Listagem, criação, edição e remoção de tarefas.
- Integração das ações de interface com a API REST.
- Estado da autenticação e das tarefas nos [stores Pinia](stores/).

## Executar localmente

1. Em um clone separado, siga a [instalação do backend](https://github.com/GabrielLucasF/task-manager-api#executar-localmente) e inicie a API em http://127.0.0.1:8000.
2. Neste repositório, execute:

```sh
npm ci
npm run dev
```

3. Abra o endereço informado pelo Nuxt. O app usa http://127.0.0.1:8000/api como base. Para usar outro endereço, configure NUXT_PUBLIC_API_BASE no ambiente.

## Roteiro de demonstração

Entre com uma conta de teste, crie uma tarefa atribuída a ela, edite o título e confira o estado após recarregar a página. Para acompanhar o caminho no código, comece em [pages](pages/), passe pelos [stores](stores/) e siga para o endpoint correspondente no backend. Use dados fictícios no ambiente local.
