# Baseline de mantenimiento para la Actividad 4

## Propósito

La guía del taller de la Sesión 5 exige ejecutar una intervención de mantenimiento y **demostrar
una mejora mediante métricas antes y después**. Ese requisito tiene una implicación que conviene
enunciar antes de nada: sin una medición previa creíble, la mejora no se puede demostrar, solo
afirmar.

Este documento fija esa medición previa. Todos los valores provienen de ejecuciones reales de
herramientas sobre el código de la versión v0.1.0. Ninguno es estimado, y ninguno se ha ajustado
para que la mejora futura parezca mayor.

## Identificación de la baseline

| Atributo              | Valor                                                      |
| --------------------- | ---------------------------------------------------------- |
| Baseline              | `BL-PROD-001`                                              |
| Versión               | v0.1.0                                                     |
| Archivo de referencia | `metrics-baseline.json`                                    |
| Registro de deuda     | `docs/technical-debt-register.md`                          |
| Control automático    | `scripts/metrics-gate.mjs`, ejecutado en cada pull request |

`metrics-baseline.json` no es documentación: es un archivo que el pipeline lee y con el que compara
cada ejecución. Esa es la diferencia entre una baseline registrada y una baseline efectiva.

## Métricas medidas

### Complejidad y tamaño

| Indicador                                  | Valor medido                     | Herramienta                       |
| ------------------------------------------ | -------------------------------- | --------------------------------- |
| Complejidad ciclomática máxima             | **26** (`processSubmission`)     | ESLint (`complexity`)             |
| Líneas de `processSubmission`              | 204                              | ESLint (`max-lines-per-function`) |
| Líneas del archivo mayor                   | 580 (`legacyEmployeeService.ts`) | ESLint (`max-lines`)              |
| Complejidad acumulada del módulo legacy    | 85                               | ESLint                            |
| Funciones medidas en el módulo legacy      | 16                               | ESLint                            |
| Complejidad de `validateRequestDraft`      | 14 (40 líneas)                   | ESLint                            |
| Complejidad de `validateMedicalLeaveDraft` | 13 (54 líneas)                   | ESLint                            |
| Complejidad máxima del resto del proyecto  | 8                                | ESLint                            |
| Archivos medidos                           | 40                               | ESLint                            |
| Funciones medidas en el proyecto           | 104                              | ESLint                            |

El último dato de contexto es el que da sentido a los anteriores: la función más compleja fuera del
módulo legacy tiene complejidad 8, frente a 26. La deuda está **concentrada, no dispersa**, lo que
significa que una intervención acotada puede producir una mejora medible en varias dimensiones a la
vez.

### Duplicación

| Indicador                 | Valor medido |
| ------------------------- | ------------ |
| Porcentaje de duplicación | **0,77 %**   |
| Clones detectados         | 2            |
| Líneas duplicadas         | 20           |
| Líneas analizadas         | 2 611        |

Clones concretos, ambos correspondientes a TD-003:

1. `legacyEmployeeService.ts` líneas 223–234 ↔ 261–272 (12 líneas) — validación de correo repetida
   entre solicitudes e incapacidades.
2. `MedicalLeavesPage.tsx` 155–164 ↔ `RequestsPage.tsx` 109–118 (10 líneas) — campo de correo
   repetido en ambos formularios.

### Cobertura de pruebas

| Indicador  | Valor medido          |
| ---------- | --------------------- |
| Sentencias | 89,19 % (322/361)     |
| Ramas      | **75,00 %** (165/220) |
| Funciones  | 91,81 % (101/110)     |
| Líneas     | 89,08 % (310/348)     |

La brecha de 14,19 puntos entre sentencias y ramas es el indicador relevante, no el porcentaje
global: señala que existen caminos condicionales sin ejercitar, principalmente casos de error y
estados alternativos. Es la materialización de TD-006.

### Acoplamiento

| Indicador                                                        | Valor medido |
| ---------------------------------------------------------------- | ------------ |
| Accesos directos a `window.localStorage` desde reglas de negocio | 8            |
| Puertos de persistencia definidos                                | **0**        |
| Contratos externos consumidos sin adaptador                      | 4            |
| Claves `snake_case` externas referenciadas por el código propio  | 24 de 24     |
| Importaciones directas de la presentación al servicio legacy     | 8            |
| Capas arquitectónicas con responsabilidad única                  | 2 de 3       |
| Llamadas acopladas a `moment`                                    | 17           |

### Seguridad

| Severidad  | Cantidad |
| ---------- | -------- |
| `critical` | 0        |
| `high`     | 0        |
| `moderate` | 0        |
| `low`      | 0        |

Cero vulnerabilidades en todas las severidades. Esto es parte de la baseline y no un dato
accesorio: establece que la deuda del proyecto es **estructural, no de seguridad**, y que la
intervención de la Actividad 4 no puede presentarse como una corrección de seguridad.

### Suite de pruebas

| Indicador                          | Valor medido                    |
| ---------------------------------- | ------------------------------- |
| Pruebas unitarias y de componentes | 60 en 10 archivos               |
| Pruebas end-to-end                 | 20 (10 flujos × 2 dispositivos) |
| Pruebas omitidas o vacías          | **0**                           |

La última fila es una condición de validez de todo lo anterior. Si la baseline se hubiera obtenido
deshabilitando pruebas, los porcentajes de cobertura serían ficción.

## Estado del módulo legacy al cerrar la Actividad 3

La medición anterior se tomó sobre v0.1.0. La Actividad 3 terminó en **v0.2.0**, que incorporó el
carné virtual y el pipeline de despliegue, de modo que corresponde comprobar si el punto de partida
de la Actividad 4 sigue siendo el mismo.

| Indicador del módulo legacy    | v0.1.0 | v0.2.0 | Variación |
| ------------------------------ | ------ | ------ | --------- |
| Complejidad ciclomática máxima | 26     | 26     | Ninguna   |
| Líneas del archivo             | 580    | 580    | Ninguna   |
| Accesos a `localStorage`       | 8      | 8      | Ninguna   |
| Clones de validación (TD-003)  | 2      | 2      | Ninguna   |

El módulo es **idéntico** en ambas versiones. Eso no ocurrió por casualidad: el carné virtual se
implementó en un módulo independiente precisamente porque RFC-001 condicionaba su aprobación a no
agravar TD-001 ni TD-005, y el control de no regresión verificó esa condición en cada pull request
con tolerancia cero.

La invariancia es en sí misma un resultado de la Actividad 3. Demuestra que la deuda quedó
**contenida**, no solo documentada: se añadió funcionalidad nueva sin que el módulo reservado
creciera ni un punto de complejidad.

Las métricas de proyecto que sí variaron, todas a mejor:

| Indicador de proyecto        | v0.1.0  | v0.2.0  |
| ---------------------------- | ------- | ------- |
| Cobertura de sentencias      | 89,19 % | 90,02 % |
| Cobertura de ramas           | 75,00 % | 75,43 % |
| Cobertura de funciones       | 91,81 % | 93,22 % |
| Duplicación                  | 0,77 %  | 0,71 %  |
| Pruebas unitarias            | 60      | 72      |
| Pruebas de extremo a extremo | 20      | 22      |

Por tanto, **la columna «antes» de la matriz sigue siendo válida** para los indicadores del módulo
legacy, que son los que la intervención debe mover. Para los indicadores de proyecto, la comparación
de la Actividad 4 debe partir de los valores de v0.2.0, que son los que quedan registrados en
`metrics-baseline.json`.

## Intervención reservada

La guía del taller de la Sesión 5 define la intervención:

> Refactorizar el servicio legacy que concentra persistencia, validaciones, transformación de datos
> y reglas de negocio.

**Esta refactorización no se ejecuta en la Actividad 3.** El código se entrega con la deuda
presente, medida y registrada.

### Deudas que aborda la intervención

| Deuda  | Relación con la intervención                        |
| ------ | --------------------------------------------------- |
| TD-009 | **Causa raíz**: ausencia de capa de dominio         |
| TD-001 | Consecuencia directa: módulo multi-responsabilidad  |
| TD-005 | Consecuencia directa: complejidad concentrada       |
| TD-002 | Se resuelve al introducir un puerto de persistencia |
| TD-003 | Se resuelve al consolidar las validaciones          |
| TD-004 | Se resuelve al extraer constantes                   |
| TD-008 | Se resuelve al introducir adaptadores explícitos    |

Siete de las nueve deudas se abordan con **un solo cambio estructural**. Esa propiedad no es
casual: TD-001 a TD-005 y TD-008 no son defectos independientes, son síntomas de la decisión
arquitectónica registrada en TD-009. Distinguir la causa de sus síntomas es lo que permite que la
intervención sea acotada y su efecto medible en cuatro dimensiones simultáneas.

TD-006 mejora como efecto secundario: separar responsabilidades hace que las reglas de negocio sean
probables sin entorno DOM. TD-007 queda fuera del alcance, porque su resolución depende de que la
refactorización concentre primero el tratamiento de fechas en un solo punto.

## Matriz antes y después

La columna «antes» recoge el estado al cerrar la Actividad 3, es decir **v0.2.0**. Para los
indicadores del módulo legacy coincide con v0.1.0, porque el módulo no se tocó.

| Dimensión                            | Antes (v0.2.0) | Después | Variación |
| ------------------------------------ | -------------- | ------- | --------- |
| Complejidad ciclomática máxima       | 26             | —       | —         |
| Líneas de la función mayor           | 204            | —       | —         |
| Líneas del archivo mayor             | 580            | —       | —         |
| Complejidad acumulada del módulo     | 85             | —       | —         |
| Duplicación del proyecto             | 0,71 %         | —       | —         |
| Clones detectados                    | 2              | —       | —         |
| Cobertura de sentencias              | 90,02 %        | —       | —         |
| Cobertura de ramas                   | 75,43 %        | —       | —         |
| Accesos directos a `localStorage`    | 8              | —       | —         |
| Puertos de persistencia              | 0              | —       | —         |
| Contratos sin adaptador              | 4              | —       | —         |
| Importaciones directas al servicio   | 8              | —       | —         |
| Capas con responsabilidad única      | 2 de 3         | —       | —         |
| Vulnerabilidades `high` o `critical` | 0              | —       | —         |

**Las columnas "después" están vacías a propósito y no se rellenarán en esta actividad.**

## Sobre los valores objetivo

No se define ningún valor objetivo en este documento. La razón no es cautela: un objetivo fijado
antes de conocer el resultado real de la refactorización se convierte, en el momento de escribir el
informe, en una cifra que hay que justificar en lugar de en una medición que hay que interpretar.

Los criterios de cierre de cada deuda —que sí están definidos en
`docs/technical-debt-register.md`— son **condiciones estructurales verificables**, no cifras. Por
ejemplo: «ninguna función del módulo supera complejidad 10» o «cero accesos a `localStorage` desde
funciones con reglas de negocio». Son comprobables sin depender de que una cifra concreta se cumpla.

## Reproducción de la medición

```bash
npm ci
npm run test:coverage        # coverage/coverage-summary.json
npm run metrics:complexity   # reports/complexity.json
npm run metrics:duplication  # reports/duplication/jscpd-report.json
npm run metrics:audit        # vulnerabilidades
npm run metrics:gate         # comparacion con la baseline
npm run evidence             # informe consolidado
```

La medición es reproducible por dos motivos que se refuerzan entre sí: las herramientas se
ejecutan localmente sin servicios externos, y `package-lock.json` congela las versiones exactas de
las dependencias. Sin lo segundo, una comparación entre la Actividad 3 y la Actividad 4 no podría
distinguir el efecto de la refactorización del efecto de una actualización de dependencias.
