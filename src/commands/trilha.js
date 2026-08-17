'use strict';

const chalk = require('chalk');
const Table = require('cli-table3');
const { tracks } = require('../data/tracks.json');

function listAvailableTracks() {
  console.log(chalk.bold.cyan('\n📚 Trilhas disponíveis:\n'));
  Object.entries(tracks).forEach(([key, track]) => {
    console.log(
      `  ${chalk.yellow(track.icon)}  ${chalk.bold.white(key.padEnd(15))} ${chalk.gray('→')} ${chalk.white(track.name)} ${chalk.dim(`(${track.duration})`)}`
    );
  });
  console.log(
    chalk.dim('\n  Uso: trilha-dev trilha <tecnologia>\n  Exemplo: trilha-dev trilha javascript\n')
  );
}

function showTrack(techKey) {
  const key = techKey.toLowerCase();
  const track = tracks[key];

  if (!track) {
    console.log(chalk.red(`\n  ✗ Trilha "${techKey}" não encontrada.\n`));
    listAvailableTracks();
    return;
  }

  // Header
  console.log(
    chalk.bold.cyan(`\n${'═'.repeat(60)}`)
  );
  console.log(
    chalk.bold.white(`  ${track.icon}  TRILHA: ${track.name.toUpperCase()}`)
  );
  console.log(chalk.bold.cyan(`${'═'.repeat(60)}`));

  console.log(`\n  ${chalk.dim('Descrição:')}  ${chalk.white(track.description)}`);
  console.log(`  ${chalk.dim('Duração:')}    ${chalk.green(track.duration)}`);
  console.log(`  ${chalk.dim('Nível:')}      ${chalk.yellow(track.level)}`);
  console.log(`  ${chalk.dim('Módulos:')}    ${chalk.white(track.modules.length + ' semanas')}`);

  console.log(chalk.bold.cyan(`\n  ${'─'.repeat(56)}`));
  console.log(chalk.bold.white('  PLANO DE ESTUDOS SEMANAL'));
  console.log(chalk.bold.cyan(`  ${'─'.repeat(56)}\n`));

  const table = new Table({
    head: [
      chalk.bold.cyan('Semana'),
      chalk.bold.cyan('Módulo'),
      chalk.bold.cyan('Tópicos')
    ],
    colWidths: [9, 28, 40],
    style: {
      head: [],
      border: ['dim'],
    },
    wordWrap: true,
  });

  track.modules.forEach((mod) => {
    table.push([
      chalk.yellow(`  ${String(mod.week).padStart(2, '0')}`),
      chalk.white(mod.title),
      chalk.dim(mod.topics.join('\n')),
    ]);
  });

  console.log(table.toString());

  console.log(
    chalk.dim(`\n  💡 Dica: use ${chalk.white('trilha-dev desafio ' + key + ' <nivel>')} para praticar!\n`) +
    chalk.dim(`  Níveis disponíveis: ${chalk.yellow('iniciante')}, ${chalk.yellow('intermediario')}, ${chalk.yellow('avancado')}\n`)
  );
}

module.exports = { showTrack, listAvailableTracks };
