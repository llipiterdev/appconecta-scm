/**
 * Punto único de inicialización de `moment` en español.
 *
 * Todos los módulos que formatean fechas para presentación importan `moment` desde aquí en
 * lugar de importarlo directamente, de modo que `moment.locale('es')` se aplica sin depender
 * de que un módulo de composición concreto se cargue primero.
 */

import moment from 'moment';

moment.locale('es');

export default moment;
