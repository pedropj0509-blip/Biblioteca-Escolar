# Biblioteca Virtual Escolar

Projeto web para gerenciamento de uma biblioteca escolar, desenvolvido para fins educacionais. A plataforma tem como objetivo permitir consulta ao acervo, pesquisa de livros, reservas e administração básica do sistema.

## Status

Fase atual: **Fase 2 - Estrutura Base**

Entregáveis da fase:

- PRD organizado em `docs/PRD.md`
- Plano de implementação em `docs/Implementation_Plan.md`
- Estrutura inicial do projeto
- README com visão geral, escopo e organização
- Estrutura HTML base das páginas
- CSS global com identidade visual inicial
- JavaScript inicial para navegação
- Header, footer e menu responsivo

## Escopo

Funcionalidades previstas:

- Cadastro de livros
- Catálogo de livros
- Pesquisa por título, autor e categoria
- Página de detalhes do livro
- Login e cadastro de usuários
- Sistema de reservas
- Área do usuário
- Painel administrativo
- Interface responsiva

Fora do escopo inicial:

- Exclusão de livros
- Edição de livros
- Aplicativo mobile
- Pagamentos online
- Controle automático de empréstimos

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MySQL

## Estrutura do projeto

```text
Biblioteca-Escolar/
├── assets/
│   ├── css/
│   ├── icons/
│   ├── images/
│   └── js/
├── docs/
│   ├── Implementation_Plan.md
│   ├── PRD.md
│   └── PRD.pdf
├── pages/
│   ├── admin.html
│   ├── cadastro.html
│   ├── catalogo.html
│   ├── detalhes.html
│   ├── login.html
│   ├── perfil.html
│   └── reservas.html
├── index.html
├── README.md
└── .gitignore
```

## Documentação

- [PRD](docs/PRD.md)
- [Plano de implementação](docs/Implementation_Plan.md)

## Identidade visual

A identidade visual seguirá a paleta definida no PRD:

- Azul escuro: `#1E3A5F`
- Azul claro: `#4F86C6`
- Branco: `#FFFFFF`
- Cinza claro: `#F3F4F6`
- Dourado suave: `#D4A017`

## Como executar

Abra o arquivo `index.html` no navegador para visualizar a estrutura base da aplicação. As funcionalidades dinâmicas serão implementadas nas próximas fases.
