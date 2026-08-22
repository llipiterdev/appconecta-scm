import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Configuracion de medicion, no de calidad.
 *
 * La regla `complexity` esta desactivada en `eslint.config.js` de forma deliberada: la
 * complejidad ciclomatica es una metrica de deuda tecnica, no un error de lint. Este archivo
 * la activa con un umbral minimo para que ESLint reporte el valor real de cada funcion, que
 * `scripts/metrics-complexity.mjs` extrae y compara contra la baseline versionada.
 *
 * Nunca se ejecuta como parte de `npm run lint`.
 */
export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'reports/**', 'node_modules/**', 'src/**/*.test.{ts,tsx}'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    rules: {
      complexity: ['warn', 1],
      'max-lines': ['warn', { max: 1, skipBlankLines: false, skipComments: false }],
      'max-lines-per-function': ['warn', { max: 1, skipBlankLines: false, skipComments: false }],
      'max-depth': ['warn', 1],
      'max-params': ['warn', 1],
    },
  }
);
