# BookAPI — Automação de Testes de API

## 📖 Sobre o Projeto

Projeto de automação de testes para a API de reservas **Restful Booker**, validando fluxos funcionais como criação, atualização, busca e exclusão de reservas.

## 🌐 Site da API

```
https://restful-booker.herokuapp.com
```

## 🛠 Tecnologias Utilizadas

### 🎭 Playwright
```
Framework de automação de testes de API
```

### 🟨 JavaScript
```
Linguagem utilizada nos testes
```

### 🗂 JSON Schema
```
Validação automática da estrutura das respostas da API
```

### 📬 Postman
```
Validação manual das requisições
```

### 🔄 CircleCI
```
Pipeline de integração contínua
```

## 🚀 Como Executar

### 1. Clonar o repositório
```bash
git clone https://github.com/Hrqlv/bookAPI.git
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Instalar o Playwright
```bash
npx playwright install
```

## ▶️ Executando os Testes

### Executar todos os testes
```bash
npm run api
```

### Executar por tag
```bash
npm run api -- --grep @SUCESSO   # Fluxos de sucesso
npm run api -- --grep @ERRO      # Fluxos de erro
```

### Visualizar relatório
```bash
npx playwright show-report
```

## 📂 Estrutura do projeto

```bash
BookAPI
│
├── .cicleci/                 # Configurações do CI com CircleCI
│
├── playwright-report/       # Relatório HTML nativo do Playwright
├── test-results/            # Resultados das execuções de testes
│
├── fixtures/
│   └── data.ts              # Dados utilizados nos testes
│
├── support/
│   └── helpers.ts           # Funções utilitárias reutilizáveis
│
├── tests/api/
│   ├── jsonSchemas/              # Schemas JSON gerados automaticamente
│   ├── jsonSchemaValidatorClasses/  # Classes de validação de schema
│   ├── pages/               # Page Objects da aplicação
│   │   ├── bookAPI.page.js
│   └── specs/               # Cenários de testes automatizados
│       ├── bookAPI.spec.js
│
├── .env                     # Variáveis de ambiente
├── .gitignore               # Arquivos ignorados pelo Git
├── package.json             # Dependências e scripts do projeto
├── playwright.config.ts     # Configuração do Playwright
└── README.md                # Documentação do projeto
```