#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const figlet = require('figlet');

const { showTrack, listAvailableTracks } = require('./commands/trilha');
const { showDesafio } = require('./commands/desafio');
const { generateCertificate } = require('./commands/certificado');

// ─── Banner ──────────────────────────────────────────────────────────────────
function printBanner() {
  const banner = figlet.textSync('trilha-dev', {
    font: 'Small',
    horizontalLayout: 'default',
  });
  console.log(chalk.bold.cyan(banner));
  console.log(chalk.dim('  CLI de Trilhas de Estudo — DIO Formação\n'));
}

// ─── Help ─────────────────────────────────────────────────────────────────────
function printHelp() {
  printBanner();
  console.log(chalk.bold.white('  COMANDOS DISPONÍVEIS\n'));

  const cmds = [
    ['trilha <tecnologia>', 'Exibe o plano de estudos completo da trilha'],
    ['desafio <tecnologia> <nivel>', 'Gera um desafio de código para praticar'],
    ['certificado <tecnologia> "Nome"', 'Emite um certificado fictício de conclusão'],
  ];

  cmds.forEach(([cmd, desc]) => {
    console.log(`  ${chalk.yellow(('trilha-dev ' + cmd).padEnd(42))} ${chalk.dim(desc)}`);
  });

  console.log(chalk.bold.white('\n  TECNOLOGIAS DISPONÍVEIS\n'));
  console.log(`  ${chalk.cyan('javascript')}  ${chalk.cyan('python')}  ${chalk.cyan('react')}  ${chalk.cyan('devops')}  ${chalk.cyan('sql')}\n`);

  console.log(chalk.bold.white('  EXEMPLOS\n'));
  const examples = [
    'trilha-dev trilha javascript',
    'trilha-dev desafio python intermediario',
    'trilha-dev desafio react avancado',
    'trilha-dev certificado javascript "Maria Silva"',
  ];
  examples.forEach((ex) => console.log(`  ${chalk.dim('$')} ${chalk.white(ex)}`));
  console.log('');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const [, , command, ...args] = process.argv;

switch (command) {
  case 'trilha':
    if (!args[0]) {
      printBanner();
      listAvailableTracks();
    } else {
      printBanner();
      showTrack(args[0]);
    }
    break;

  case 'desafio':
    printBanner();
    showDesafio(args[0], args[1]);
    break;

  case 'certificado':
    printBanner();
    // Name may be multiple args if user didn't quote — join them
    generateCertificate(args[0], args.slice(1).join(' '));
    break;

  case '--help':
  case '-h':
  case 'ajuda':
    printHelp();
    break;

  default:
    printHelp();
    break;
}
