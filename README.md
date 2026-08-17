# trilha-dev 🎓

CLI de trilhas de estudo fictícias com desafios de código e certificados — projeto final da DIO Formação.

## Instalação

```bash
npm install
npm link   # opcional: permite usar `trilha-dev` globalmente
```

## Comandos

### `trilha <tecnologia>`
Exibe o plano de estudos semanal completo da trilha escolhida.

```bash
node src/index.js trilha javascript
node src/index.js trilha python
node src/index.js trilha react
node src/index.js trilha devops
node src/index.js trilha sql
```

### `desafio <tecnologia> <nivel>`
Gera um desafio de código aleatório para a tecnologia e nível informados.

**Níveis disponíveis:** `iniciante` · `intermediario` · `avancado`

```bash
node src/index.js desafio javascript iniciante
node src/index.js desafio python intermediario
node src/index.js desafio devops avancado
```

### `certificado <tecnologia> "Nome Completo"`
Emite um certificado fictício de conclusão da trilha para o aluno informado, com código único de identificação.

```bash
node src/index.js certificado javascript "Maria Silva"
node src/index.js certificado react "João Castro"
```

## Trilhas disponíveis

| Chave        | Nome                        | Duração    |
|--------------|-----------------------------|------------|
| javascript   | JavaScript Moderno          | 12 semanas |
| python       | Python para Dados e Backend | 14 semanas |
| react        | React e Ecossistema         | 10 semanas |
| devops       | DevOps e Cloud              | 16 semanas |
| sql          | SQL e Banco de Dados        | 8 semanas  |

## Estrutura do projeto

```
src/
├── index.js              # Entry point + roteamento de comandos
├── commands/
│   ├── trilha.js         # Comando: plano de estudos
│   ├── desafio.js        # Comando: desafio de código
│   └── certificado.js    # Comando: geração de certificado
└── data/
    └── tracks.json       # Base de trilhas e desafios fictícios
```

## Tecnologias utilizadas

- [chalk](https://github.com/chalk/chalk) — colorização de terminal
- [figlet](https://github.com/patorjk/figlet.js) — banner ASCII
- [boxen](https://github.com/sindresorhus/boxen) — caixas de destaque
- [cli-table3](https://github.com/cli-table/cli-table3) — tabelas no terminal

---
> Projeto fictício criado para fins educacionais — DIO Formação Bob.
