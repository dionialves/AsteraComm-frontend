# AsteraComm Frontend

AsteraComm Frontend é a interface visual do sistema AsteraComm, projetada para facilitar o gerenciamento e monitoramento do Asterisk. Esta aplicação consome a API do backend e apresenta os dados de forma amigável ao usuário, atualmente focando na exibição dos endpoints registrados no sistema VoIP.

O frontend foi desenvolvido com foco em simplicidade, desempenho e integração eficiente com o backend, utilizando tecnologias modernas como React, Vite e Docker.
<br>
<br>
## 🚀 Tecnologias

- **React**: Biblioteca para construção de interfaces de usuário.
- **Vite**: Build tool rápida e moderna para projetos frontend.
- **Axios**: Cliente HTTP para comunicação com a API backend.
- **React Router**: Para navegação entre páginas da aplicação.
<br>

## 🌐 Repositórios

- **Projeto Principal**: [AsteraComm](https://github.com/dionialves/AsteraComm)
- **Frontend**: [AsteraComm-frontend](https://github.com/dionialves/AsteraComm-frontend)
- **Backend**: [AsteraComm-backend](https://github.com/dionialves/AsteraComm-backend)
<br>

## ⚙️ Como Rodar o Frontend Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- npm ou yarn

### Passos para rodar

1. Clone o repositório:

```bash
git clone https://github.com/dionialves/AsteraComm-frontend.git
cd AsteraComm-frontend
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento com Vite:

```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação em `http://localhost:5173` (ou a porta que o Vite informar).
<br>

## 📦 Funcionalidades Atuais

- ✅ Exibição de endpoints registrados do Asterisk, consumindo a API do backend.

Outras funcionalidades como chamadas ativas, histórico (CDRs), gerenciamento de filas e ramais serão implementadas nas próximas versões, conforme descrito no [ROADMAP.md](https://github.com/dionialves/AsteraComm/blob/main/ROADMAP.md).


## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais informações.
