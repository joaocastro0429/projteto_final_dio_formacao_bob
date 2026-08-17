'use strict';

const chalk = require('chalk');
const boxen = require('boxen');
const { tracks } = require('../data/tracks.json');

function generateCertificate(techKey, studentName) {
  const key = techKey ? techKey.toLowerCase() : null;

  if (!key || !tracks[key]) {
    console.log(chalk.red(`\n  ✗ Tecnologia "${techKey || ''}" não encontrada.\n`));
    console.log(chalk.dim('  Tecnologias disponíveis: ') + chalk.yellow(Object.keys(tracks).join(', ')));
    console.log(chalk.dim('  Uso: trilha-dev certificado <tecnologia> "Nome Completo"\n'));
    return;
  }

  if (!studentName || studentName.trim() === '') {
    console.log(chalk.red('\n  ✗ Informe o nome do aluno entre aspas.\n'));
    console.log(chalk.dim(`  Uso: trilha-dev certificado ${key} "Nome Completo"\n`));
    return;
  }

  const track = tracks[key];
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Generate a deterministic-looking certificate ID
  const hash = [...(studentName + key + now.getFullYear())].reduce(
    (acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0,
    0
  );
  const certId = 'DIO-' + key.slice(0, 3).toUpperCase() + '-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0').slice(0, 8);

  const border = chalk.bold.cyan('★'.repeat(62));
  const innerBorder = chalk.cyan('·'.repeat(62));
  const blank = '';

  const lines = [
    blank,
    chalk.bold.cyan('            ✦  CERTIFICADO DE CONCLUSÃO  ✦'),
    blank,
    chalk.dim('                  DIO — Digital Innovation One'),
    blank,
    innerBorder,
    blank,
    chalk.dim('            Certificamos que'),
    blank,
    chalk.bold.white('            ' + studentName.toUpperCase()),
    blank,
    chalk.dim('            concluiu com êxito a trilha de estudos'),
    blank,
    chalk.bold.yellow(`            ${track.icon}  ${track.name.toUpperCase()}`),
    blank,
    chalk.dim(`            Carga horária equivalente: ${chalk.white(track.duration)}`),
    chalk.dim(`            Nível alcançado: ${chalk.white(track.level)}`),
    blank,
    innerBorder,
    blank,
    chalk.dim(`            Data de emissão: ${chalk.white(dateStr)}`),
    chalk.dim(`            Código do certificado: ${chalk.white(certId)}`),
    blank,
    chalk.dim('            Este é um certificado fictício gerado pela'),
    chalk.dim('            CLI trilha-dev para fins educacionais.'),
    blank,
  ];

  console.log('\n' + border);
  lines.forEach((line) => console.log(line));
  console.log(border + '\n');

  // Framed summary with boxen
  const summaryBox = [
    `${chalk.bold('Trilha:')}     ${chalk.yellow(track.name)}`,
    `${chalk.bold('Aluno:')}      ${chalk.white(studentName)}`,
    `${chalk.bold('Duração:')}    ${chalk.green(track.duration)}`,
    `${chalk.bold('Certificado:')} ${chalk.cyan(certId)}`,
    `${chalk.bold('Emitido em:')} ${chalk.white(dateStr)}`,
  ].join('\n');

  console.log(
    boxen(summaryBox, {
      title: chalk.bold.cyan(' 📄 Resumo '),
      titleAlignment: 'center',
      padding: { top: 1, bottom: 1, left: 3, right: 3 },
      margin: { left: 4 },
      borderStyle: 'double',
      borderColor: 'yellow',
    })
  );

  console.log(
    chalk.dim('\n  💾 Guarde o código do certificado para referência futura.\n') +
    chalk.dim(`  🚀 Próximo passo: desafie-se em ${chalk.white('trilha-dev desafio ' + key + ' avancado')}\n`)
  );
}

module.exports = { generateCertificate };
