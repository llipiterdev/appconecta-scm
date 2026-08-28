/**
 * Constantes compartidas de la capa de adaptadores.
 *
 * Cierra TD-004: las claves de almacenamiento y el límite de registros estaban repetidos
 * como literales en el módulo legacy. Aquí se definen una sola vez.
 */

export const STORAGE_KEYS = {
  requests: 'appconecta.solicitudes',
  medicalLeaves: 'appconecta.incapacidades',
} as const;

export const MAX_STORED_RECORDS = 20;

export const MOCK_DATE_FORMAT = 'DD/MM/YYYY';
