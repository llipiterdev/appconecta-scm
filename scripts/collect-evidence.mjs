#!/usr/bin/env node
/**
 * Recopilacion reproducible de evidencias.
 *
 * Ejecuta las verificaciones del proyecto y registra su resultado real. Reglas de diseno:
 *
 * - Falla si una validacion falla. Un informe de evidencias que oculta un fallo no es evidencia.
 * - Registra fecha, commit SHA y version.
 * - No fabrica salidas ni corrige resultados.
 * - Excluye tokens y credenciales: la URL del remoto se publica sin la parte de autenticacion.
 *
 * Uso: npm run evidence [-- --skip-e2e] [-- --skip-docker]
 */

import { execFileSync, execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = resolve(projectRoot, 'reports/evidence');
const args = process.argv.slice(2);
const skip = new Set(
  args.filter((arg) => arg.startsWith('--skip-')).map((arg) => arg.replace('--skip-', ''))
);

function git(command) {
  return execSync(`git ${command}`, { cwd: projectRoot, encoding: 'utf8' }).trim();
}

/** Una URL de remoto puede contener un token embebido. Se elimina antes de publicarla. */
function sanitizeRemote(output) {
  return output.replace(/\/\/[^@\s/]+@/g, '//');
}

const packageJson = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'));

const context = {
  collectedAt: new Date().toISOString(),
  version: packageJson.version,
  commit: git('rev-parse HEAD'),
  shortCommit: git('rev-parse --short HEAD'),
  branch: git('rev-parse --abbrev-ref HEAD'),
  nodeVersion: process.version,
  workingTreeClean: git('status --porcelain').length === 0,
};

const gitEvidence = {
  status: git('status --short --branch'),
  remotes: sanitizeRemote(git('remote -v')),
  branches: git('branch -a'),
  tags: git('tag -n') || '(sin tags)',
  graph: git('log --graph --decorate --oneline --all'),
  commitCount: Number(git('rev-list --count HEAD')),
};

const validations = [
  { id: 'install', label: 'Instalacion reproducible', command: ['npm', 'ci'] },
  { id: 'format', label: 'Formato (Prettier)', command: ['npm', 'run', 'format:check'] },
  { id: 'lint', label: 'Analisis estatico (ESLint)', command: ['npm', 'run', 'lint'] },
  { id: 'typecheck', label: 'Verificacion de tipos', command: ['npm', 'run', 'typecheck'] },
  { id: 'test', label: 'Pruebas unitarias y de componentes', command: ['npm', 'run', 'test'] },
  { id: 'coverage', label: 'Cobertura', command: ['npm', 'run', 'test:coverage'] },
  { id: 'build', label: 'Build de produccion', command: ['npm', 'run', 'build'] },
  {
    id: 'complexity',
    label: 'Complejidad ciclomatica',
    command: ['npm', 'run', 'metrics:complexity'],
  },
  { id: 'duplication', label: 'Duplicacion', command: ['npm', 'run', 'metrics:duplication'] },
  {
    id: 'audit',
    label: 'Vulnerabilidades de dependencias',
    command: ['npm', 'run', 'metrics:audit'],
  },
  { id: 'gate', label: 'Control de no regresion', command: ['npm', 'run', 'metrics:gate'] },
  { id: 'e2e', label: 'Pruebas end-to-end', command: ['npm', 'run', 'test:e2e'], optional: true },
  {
    id: 'docker',
    label: 'Construccion de imagen',
    command: ['docker', 'build', '-t', 'appconecta-scm:evidence', '.'],
    optional: true,
  },
];

const results = [];
let failed = false;

for (const validation of validations) {
  if (skip.has(validation.id)) {
    results.push({ ...describe(validation), status: 'omitida', reason: 'solicitado con --skip' });
    console.log(`OMITIDA  ${validation.label}`);
    continue;
  }

  const startedAt = Date.now();

  try {
    const [command, ...commandArgs] = validation.command;
    const output = execFileSync(command, commandArgs, {
      cwd: projectRoot,
      encoding: 'utf8',
      shell: process.platform === 'win32',
      maxBuffer: 64 * 1024 * 1024,
    });

    results.push({
      ...describe(validation),
      status: 'exito',
      durationMs: Date.now() - startedAt,
      output: tail(output),
    });
    console.log(`OK       ${validation.label}`);
  } catch (error) {
    const output = tail(`${error.stdout ?? ''}\n${error.stderr ?? ''}`);

    results.push({
      ...describe(validation),
      status: 'fallo',
      durationMs: Date.now() - startedAt,
      output,
    });

    if (validation.optional) {
      console.warn(`AVISO    ${validation.label} no pudo ejecutarse en este entorno`);
    } else {
      console.error(`FALLO    ${validation.label}`);
      failed = true;
    }
  }
}

function describe(validation) {
  return { id: validation.id, label: validation.label, command: validation.command.join(' ') };
}

/** Solo se conservan las ultimas lineas: el informe documenta el resultado, no el log completo. */
function tail(output, lines = 25) {
  return output
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .slice(-lines)
    .join('\n');
}

const metrics = {};

if (existsSync(resolve(projectRoot, 'coverage/coverage-summary.json'))) {
  const total = JSON.parse(
    readFileSync(resolve(projectRoot, 'coverage/coverage-summary.json'), 'utf8')
  ).total;

  metrics.coverage = {
    statements: total.statements.pct,
    branches: total.branches.pct,
    functions: total.functions.pct,
    lines: total.lines.pct,
  };
}

if (existsSync(resolve(projectRoot, 'reports/complexity.json'))) {
  metrics.complexity = JSON.parse(
    readFileSync(resolve(projectRoot, 'reports/complexity.json'), 'utf8')
  ).totals;
}

if (existsSync(resolve(projectRoot, 'reports/duplication/jscpd-report.json'))) {
  const total = JSON.parse(
    readFileSync(resolve(projectRoot, 'reports/duplication/jscpd-report.json'), 'utf8')
  ).statistics.total;

  metrics.duplication = {
    percentage: total.percentage,
    clones: total.clones,
    duplicatedLines: total.duplicatedLines,
  };
}

const report = { context, git: gitEvidence, validations: results, metrics };

mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, 'evidence.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(resolve(outputDir, 'evidence.md'), renderMarkdown(report), 'utf8');

function renderMarkdown({ context: ctx, git: gitData, validations: checks, metrics: measured }) {
  const rows = checks
    .map((check) => `| ${check.label} | \`${check.command}\` | ${check.status} |`)
    .join('\n');

  const metricRows = [
    measured.coverage &&
      `| Cobertura de sentencias | ${measured.coverage.statements} % |\n| Cobertura de ramas | ${measured.coverage.branches} % |\n| Cobertura de funciones | ${measured.coverage.functions} % |\n| Cobertura de lineas | ${measured.coverage.lines} % |`,
    measured.complexity &&
      `| Complejidad ciclomatica maxima | ${measured.complexity.maxComplexity} |\n| Lineas del archivo mayor | ${measured.complexity.largestFileLines} |\n| Funciones medidas | ${measured.complexity.functionsMeasured} |`,
    measured.duplication &&
      `| Duplicacion | ${measured.duplication.percentage} % |\n| Clones detectados | ${measured.duplication.clones} |\n| Lineas duplicadas | ${measured.duplication.duplicatedLines} |`,
  ]
    .filter(Boolean)
    .join('\n');

  return `# Evidencias de ejecucion — AppConecta

> Generado por \`npm run evidence\`. Los valores provienen de la ejecucion registrada abajo y no
> se han editado a mano.

## Contexto

| Dato | Valor |
| --- | --- |
| Fecha de recopilacion | ${ctx.collectedAt} |
| Version (\`package.json\`) | ${ctx.version} |
| Commit | \`${ctx.commit}\` |
| Rama | ${ctx.branch} |
| Node | ${ctx.nodeVersion} |
| Arbol de trabajo limpio | ${ctx.workingTreeClean ? 'si' : 'no'} |
| Commits en el historial | ${gitData.commitCount} |

## Validaciones ejecutadas

| Validacion | Comando | Resultado |
| --- | --- | --- |
${rows}

## Metricas medidas

| Indicador | Valor |
| --- | --- |
${metricRows}

## Estado del repositorio

\`\`\`
${gitData.status}
\`\`\`

### Remotos

\`\`\`
${gitData.remotes}
\`\`\`

### Ramas

\`\`\`
${gitData.branches}
\`\`\`

### Tags

\`\`\`
${gitData.tags}
\`\`\`

### Grafo de commits

\`\`\`
${gitData.graph}
\`\`\`
`;
}

console.log(`\nEvidencias escritas en reports/evidence/`);

if (failed) {
  console.error('\nAlguna validacion obligatoria fallo. El informe registra el fallo tal cual.');
  process.exit(1);
}
