#!/usr/bin/env node
/**
 * Control de no regresion de metricas.
 *
 * La deuda tecnica registrada puede permanecer: esta documentada y reservada para la Actividad 4.
 * Lo que no puede ocurrir es que empeore en silencio. Este script compara las mediciones actuales
 * con `metrics-baseline.json` y falla si alguna dimension se degrada por encima de la tolerancia
 * declarada.
 *
 * No corrige, no ajusta y no interpreta: compara y reporta.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function readJson(relativePath) {
  const path = resolve(projectRoot, relativePath);

  if (!existsSync(path)) {
    console.error(`No se encuentra ${relativePath}. Ejecute las mediciones antes del control.`);
    process.exit(1);
  }

  return JSON.parse(readFileSync(path, 'utf8'));
}

const baseline = readJson('metrics-baseline.json');
const findings = [];
const checks = [];

function record(dimension, indicator, baselineValue, currentValue, allowed, degraded) {
  checks.push({ dimension, indicator, baselineValue, currentValue, allowed, degraded });

  if (degraded) {
    findings.push(
      `${dimension} — ${indicator}: baseline ${baselineValue}, actual ${currentValue} (limite ${allowed})`
    );
  }
}

// --- Cobertura -----------------------------------------------------------------------------
const coverage = readJson('coverage/coverage-summary.json').total;
const coverageTolerance = baseline.coverage.tolerancePoints;

for (const indicator of ['statements', 'branches', 'functions', 'lines']) {
  const baselineValue = baseline.coverage[indicator];
  const currentValue = Number(coverage[indicator].pct.toFixed(2));
  const allowed = Number((baselineValue - coverageTolerance).toFixed(2));

  record(
    'Cobertura',
    indicator,
    baselineValue,
    currentValue,
    `>= ${allowed}`,
    currentValue < allowed
  );
}

// --- Complejidad ---------------------------------------------------------------------------
const complexity = readJson('reports/complexity.json');
const currentMaxComplexity = complexity.totals.maxComplexity;
const allowedComplexity = baseline.complexity.maxComplexity + baseline.complexity.tolerance;

record(
  'Complejidad',
  'complejidad ciclomatica maxima',
  baseline.complexity.maxComplexity,
  currentMaxComplexity,
  `<= ${allowedComplexity}`,
  currentMaxComplexity > allowedComplexity
);

const currentLargestFile = complexity.totals.largestFileLines;

record(
  'Complejidad',
  'lineas del archivo mayor',
  baseline.complexity.largestFileLines,
  currentLargestFile,
  `<= ${baseline.complexity.largestFileLines}`,
  currentLargestFile > baseline.complexity.largestFileLines
);

// --- Duplicacion ---------------------------------------------------------------------------
const duplication = readJson('reports/duplication/jscpd-report.json').statistics.total;
const currentDuplication = Number(duplication.percentage.toFixed(2));
const allowedDuplication = Number(
  (baseline.duplication.percentage + baseline.duplication.tolerancePoints).toFixed(2)
);

record(
  'Duplicacion',
  'porcentaje de lineas duplicadas',
  baseline.duplication.percentage,
  currentDuplication,
  `<= ${allowedDuplication}`,
  currentDuplication > allowedDuplication
);

// --- Vulnerabilidades ----------------------------------------------------------------------
const auditPath = resolve(projectRoot, 'reports/audit.json');

if (existsSync(auditPath)) {
  const audit = JSON.parse(readFileSync(auditPath, 'utf8'));
  const severities = audit.metadata?.vulnerabilities ?? {};

  for (const severity of ['critical', 'high']) {
    const currentValue = severities[severity] ?? 0;
    const allowed = baseline.vulnerabilities[severity] + baseline.vulnerabilities.tolerance;

    record(
      'Vulnerabilidades',
      severity,
      baseline.vulnerabilities[severity],
      currentValue,
      `<= ${allowed}`,
      currentValue > allowed
    );
  }
} else {
  console.warn('No se encuentra reports/audit.json; la dimension de vulnerabilidades se omite.');
}

// --- Resultado -----------------------------------------------------------------------------
console.log(`Control de no regresion frente a la baseline de ${baseline.version}\n`);

for (const check of checks) {
  const mark = check.degraded ? 'FALLA' : '  ok ';

  console.log(
    `${mark} ${check.dimension} · ${check.indicator}: ${check.currentValue} (baseline ${check.baselineValue}, limite ${check.allowed})`
  );
}

if (findings.length > 0) {
  console.error('\nLas metricas han empeorado respecto a la baseline:\n');

  for (const finding of findings) {
    console.error(`  - ${finding}`);
  }

  console.error(
    '\nLa deuda registrada puede permanecer, pero no crecer. Si el cambio justifica una nueva' +
      '\nbaseline, actualice metrics-baseline.json de forma explicita y documente la razon en el' +
      '\nregistro de deuda tecnica.'
  );
  process.exit(1);
}

console.log(`\n${checks.length} indicadores dentro de la baseline.`);
