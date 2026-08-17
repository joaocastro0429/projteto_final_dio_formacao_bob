'use strict';

const chalk = require('chalk');
const boxen = require('boxen');
const { tracks } = require('../data/tracks.json');

const VALID_LEVELS = ['iniciante', 'intermediario', 'avancado'];

function showDesafio(techKey, levelKey) {
  const key = techKey ? techKey.toLowerCase() : null;
  const level = levelKey ? levelKey.toLowerCase() : null;

  if (!key || !tracks[key]) {
    console.log(chalk.red(`\n  ✗ Tecnologia "${techKey || ''}" não encontrada.\n`));
    console.log(chalk.dim('  Tecnologias disponíveis: ') + chalk.yellow(Object.keys(tracks).join(', ')));
    console.log(chalk.dim('  Uso: trilha-dev desafio <tecnologia> <nivel>\n'));
    return;
  }

  if (!level || !VALID_LEVELS.includes(level)) {
    console.log(chalk.red(`\n  ✗ Nível "${levelKey || ''}" inválido.\n`));
    console.log(chalk.dim('  Níveis válidos: ') + chalk.yellow(VALID_LEVELS.join(', ')));
    console.log(chalk.dim(`  Uso: trilha-dev desafio ${key} <nivel>\n`));
    return;
  }

  const track = tracks[key];
  const challengeList = track.challenges[level];

  if (!challengeList || challengeList.length === 0) {
    console.log(chalk.red(`\n  ✗ Nenhum desafio encontrado para ${key} nível ${level}.\n`));
    return;
  }

  // Pick random challenge from the level's list
  const challenge = challengeList[Math.floor(Math.random() * challengeList.length)];

  const levelColors = {
    iniciante: chalk.green,
    intermediario: chalk.yellow,
    avancado: chalk.red,
  };
  const levelColor = levelColors[level];
  const levelLabel = levelColor(`[${level.toUpperCase()}]`);

  console.log(chalk.bold.cyan(`\n${'═'.repeat(60)}`));
  console.log(chalk.bold.white(`  🧩 DESAFIO ${track.icon} ${track.name} ${levelLabel}`));
  console.log(chalk.bold.cyan(`${'═'.repeat(60)}\n`));

  const challengeBox = [
    `${chalk.bold.white('🎯 ' + challenge.title)}`,
    '',
    `${chalk.dim('Descrição:')}`,
    `${chalk.white(challenge.description)}`,
    '',
    `${chalk.dim('💡 Dica:')}`,
    `${chalk.italic.gray(challenge.hint)}`,
    '',
    `${chalk.dim('📌 Exemplo:')}`,
    `${chalk.cyan(challenge.example)}`,
  ].join('\n');

  console.log(
    boxen(challengeBox, {
      padding: { top: 1, bottom: 1, left: 2, right: 2 },
      margin: { left: 2 },
      borderStyle: 'round',
      borderColor: 'cyan',
    })
  );

  console.log(
    chalk.dim(`\n  ✅ Concluiu este desafio? Gere seu certificado com:\n`) +
    chalk.white(`     trilha-dev certificado ${key} "Seu Nome"\n`)
  );
}

module.exports = { showDesafio };
