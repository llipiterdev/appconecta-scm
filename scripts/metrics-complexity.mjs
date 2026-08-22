#!/usr/bin/env node
/**
 * Mide la complejidad ciclomatica y el tamano de los modulos a partir de los mensajes que
 * ESLint emite con `eslint.metrics.config.js`.
 *
 * El script no interpreta ni ajusta los valores: extrae el numero que ESLint reporta y lo
 * escribe tal cual. Si no puede medir, falla en lugar de inventar un resultado.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(projectRoot, 'reports/complexity.json');

function runEslint() {
  try {
    return execFileSync(
      process.execPath,
      [
        resolve(projectRoot, 'node_modules/eslint/bin/eslint.js'),
        '--config',
        'eslint.metrics.config.js',
        '--format',
        'json',
        'src',
      ],
      { cwd: projectRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
    );
  } catch (error) {
    // ESLint termina con codigo distinto de cero cuando hay hallazgos; los mensajes viajan
    // en stdout y son exactamente lo que necesitamos medir.
    if (typeof error.stdout === 'string' && error.stdout.length > 0) {
      return error.stdout;
    }

    throw error;
  }
}

// ESLint redacta el mensaje como "has a complexity of N"; versiones anteriores usaban
// "cyclomatic complexity of N". Se aceptan ambas formas para no depender de la version.
const complexityPattern = /has a (?:cyclomatic )?complexity of (\d+)/i;
const fileLinesPattern = /has too many lines \((\d+)\)/i;
const functionLinesPattern = /has too many lines \((\d+)\)/i;
const depthPattern = /Blocks are nested too deeply \((\d+)\)/i;
const paramsPattern = /has too many parameters \((\d+)\)/i;

function relative(filePath) {
  return filePath.replace(projectRoot, '').replace(/\\/g, '/').replace(/^\//, '');
}

const results = JSON.parse(runEslint());
const files = [];
let measuredMessages = 0;

for (const result of results) {
  const file = relative(result.filePath);
  const functions = [];
  let fileLines = 0;
  let maxDepth = 0;
  let maxParams = 0;

  // Las reglas `complexity` y `max-lines-per-function` reportan la misma funcion en mensajes
  // distintos. Se fusionan por linea para no contar dos veces la misma funcion.
  const entryAt = (line, message) => {
    let entry = functions.find((item) => item.line === line);

    if (!entry) {
      entry = { line, name: extractName(message), complexity: 0, lines: 0 };
      functions.push(entry);
    }

    return entry;
  };

  for (const message of result.messages) {
    measuredMessages += 1;

    if (message.ruleId === 'complexity') {
      const match = complexityPattern.exec(message.message);

      if (match) {
        entryAt(message.line, message.message).complexity = Number(match[1]);
      }
    }

    if (message.ruleId === 'max-lines') {
      const match = fileLinesPattern.exec(message.message);

      if (match) {
        fileLines = Number(match[1]);
      }
    }

    if (message.ruleId === 'max-lines-per-function') {
      const match = functionLinesPattern.exec(message.message);

      if (match) {
        entryAt(message.line, message.message).lines = Number(match[1]);
      }
    }

    if (message.ruleId === 'max-depth') {
      const match = depthPattern.exec(message.message);

      if (match) {
        maxDepth = Math.max(maxDepth, Number(match[1]));
      }
    }

    if (message.ruleId === 'max-params') {
      const match = paramsPattern.exec(message.message);

      if (match) {
        maxParams = Math.max(maxParams, Number(match[1]));
      }
    }
  }

  functions.sort((left, right) => right.complexity - left.complexity);

  files.push({
    file,
    lines: fileLines,
    maxDepth,
    maxParams,
    maxComplexity: functions.reduce((max, item) => Math.max(max, item.complexity), 0),
    totalComplexity: functions.reduce((total, item) => total + item.complexity, 0),
    functions,
  });
}

function extractName(message) {
  const quoted = /'([^']+)'/.exec(message);

  if (quoted) {
    return quoted[1];
  }

  if (/^Arrow function/.test(message)) {
    return '(arrow function)';
  }

  if (/^Function/.test(message)) {
    return '(anonymous function)';
  }

  return '(unnamed)';
}

if (measuredMessages === 0) {
  console.error(
    'No se obtuvo ninguna medicion de ESLint. Revise eslint.metrics.config.js antes de continuar.'
  );
  process.exit(1);
}

files.sort((left, right) => right.maxComplexity - left.maxComplexity);

const report = {
  generatedAt: new Date().toISOString(),
  tool: 'eslint',
  configuration: 'eslint.metrics.config.js',
  totals: {
    files: files.length,
    functionsMeasured: files.reduce((total, item) => total + item.functions.length, 0),
    maxComplexity: files.reduce((max, item) => Math.max(max, item.maxComplexity), 0),
    largestFileLines: files.reduce((max, item) => Math.max(max, item.lines), 0),
  },
  files,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Reporte de complejidad escrito en ${relative(outputPath)}`);
console.log(
  `Archivos medidos: ${report.totals.files} · funciones: ${report.totals.functionsMeasured} · complejidad maxima: ${report.totals.maxComplexity}`
);

const top = files.slice(0, 5);

for (const file of top) {
  const worst = file.functions[0];

  console.log(
    `  ${file.file} — lineas: ${file.lines}, complejidad maxima: ${file.maxComplexity}` +
      (worst ? ` (${worst.name})` : '')
  );
}
