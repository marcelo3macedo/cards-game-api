# 🃏 TCG Game API

Uma API robusta para jogos de cartas colecionáveis (estilo Yu-Gi-Oh!), construída com **Node.js 22**, seguindo os princípios de **Clean Architecture** para garantir escalabilidade e fácil manutenção.



## 🚀 Tecnologias
* **Node.js v22.17.0** (suporte a recursos modernos de runtime)
* **Express 5.x** (Framework web)
* **Sequelize 6.x** (ORM para MySQL)
* **MySQL 8.0** (Banco de dados relacional)
* **Biome.js** (Linter e Formatter ultra-rápido)

---

## 🏗️ Estrutura do Projeto (Clean Architecture)

O projeto está dividido em camadas para isolar a lógica de negócio dos detalhes técnicos:

* `src/core/`: Entidades de domínio e casos de uso (regras do jogo, lógica de batalha, IA).
* `src/infrastructure/`: Implementações técnicas (conexão MySQL, modelos Sequelize, repositórios, cache em memória).
* `src/presentation/`: Interface de entrada (Rotas Express e Controllers).

---

## 🛠️ Instalação e Configuração

1.  **Clonar o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/tcg-game-api.git](https://github.com/seu-usuario/tcg-game-api.git)
    cd tcg-game-api
    ```

2.  **Instalar dependências:**
    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto com as credenciais do seu MySQL local:
    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=
    DB_PASS=
    DB_NAME=gameCartasApi
    PORT=3000
    ```

4.  **Inicializar o Linter (Biome):**
    ```bash
    npx @biomejs/biome init
    ```

---

## 🏃 Scripts Disponíveis

* `npm run dev`: Inicia o servidor em modo de desenvolvimento com **nodemon**.
* `npm start`: Inicia o servidor em modo de produção.
* `npm run check`: Executa o **Biome** para formatar e corrigir o código automaticamente.
* `npm run lint`: Apenas verifica erros de estilo no código.

---

## 🛡️ Funcionalidades Implementadas

### 🎴 Gerenciamento de Cartas
* Criação de cartas com atributos (Light, Dark, Fire, etc).
* Sistema de estrelas (Stars), Ataque, Defesa e Elemento.
* Tipos especializados: Monstros, Mágicas, Armadilhas e Equipamentos.

### 👤 Usuários e Decks
* Criação de perfil com foto (Profile Pictures).
* Gerenciamento de **Main Deck** e **Library**.
* Sistema de autenticação simples via Token.

### ⚔️ Engine de Batalha (Duelo)
* Sistema de turnos entre Jogador e Vilão.
* Cálculo de dano automático e gerenciamento de HP (8000).
* **IA do Vilão**: Oponente decide automaticamente qual carta invocar e quem atacar.
* Histórico de batalhas persistido no banco de dados.

---

## 📡 Principais Endpoints

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/users` | Cria um novo jogador |
| `GET` | `/cards` | Lista todas as cartas (suporta filtros) |
| `POST` | `/battle-engine/start` | Inicia um novo duelo |
| `POST` | `/battle-engine/attack` | Realiza um ataque no duelo ativo |
| `GET` | `/decks/:userId/shuffle` | Sorteia/Embaralha o deck do jogador |

---

## 📝 Licença
Este projeto está sob a licença ISC.