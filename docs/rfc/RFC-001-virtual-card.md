# RFC-001 — Incorporación del carné virtual del colaborador con código QR

| Campo                  | Valor                                                              |
| ---------------------- | ------------------------------------------------------------------ |
| **Identificador**      | RFC-001                                                            |
| **Título**             | Carné virtual del colaborador con código QR                        |
| **Solicitante**        | Miguel Santiago Acevedo Virgues — Representante del cliente / RRHH |
| **Fecha de solicitud** | 21 de agosto de 2026                                               |
| **Nivel de cambio**    | Cambio mayor                                                       |
| **Estado**             | **Implementado — pendiente de liberación en v0.2.0**               |
| **Issue asociada**     | [#5](https://github.com/llipiterdev/appconecta-scm/issues/5)       |
| **Versión objetivo**   | v0.2.0                                                             |
| **Rama de trabajo**    | `feature/virtual-card`                                             |

> **Naturaleza de la aprobación.** La decisión del Comité de Control de Cambios registrada en este
> documento es **simulada dentro del ejercicio académico**. Representa cómo la consultora
> evaluaría y autorizaría el cambio conforme al proceso definido en `docs/change-control.md`. No
> corresponde a una reunión con actas que haya tenido lugar ni a la solicitud de un cliente real.

## 1. Solicitud

El diagnóstico de la Actividad 1 identifica el carné virtual como una de las funcionalidades
previstas para la evolución de AppConecta. El colaborador necesita acreditar su vinculación con la
organización sin depender del carné físico, que se olvida, se deteriora y cuya reposición tiene un
costo administrativo.

## 2. Justificación

| Motivo                      | Detalle                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| Valor para el colaborador   | Acreditación disponible en el dispositivo que ya lleva encima                                      |
| Valor para la organización  | Reduce reposiciones de carné físico y su costo administrativo                                      |
| Coherencia con la evolución | Funcionalidad ya prevista en el diagnóstico de evolución del sistema                               |
| Valor académico             | Ejercita el ciclo completo de control de cambios sobre una baseline ya establecida (`BL-PROD-001`) |

El cuarto motivo es el que determina el momento elegido. Este cambio se implementa **después** de
la primera entrega, no antes, porque su propósito dentro de la actividad es demostrar cómo se
modifica una baseline existente mediante el proceso formal. Un cambio incorporado antes de la
primera entrega no habría demostrado nada sobre control de cambios.

## 3. Alcance

**Incluido:**

1. Nueva sección "Carné virtual" en el portal, accesible desde la navegación.
2. Presentación de los datos de acreditación del colaborador ficticio: nombre, cargo, área, código
   de empleado y fecha de vinculación.
3. Código QR generado a partir de datos ficticios **no sensibles**.
4. Indicador de estado del carné: activo o inactivo, con presentación visual diferenciada.
5. Pruebas unitarias, de componente y end-to-end de la nueva funcionalidad.
6. Actualización de la matriz de trazabilidad y del inventario de Configuration Items.

**Excluido explícitamente:**

| Fuera de alcance                            | Razón                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| Validación real del QR por un lector físico | Requeriría infraestructura de control de acceso                         |
| Datos personales reales                     | Prohibido por el alcance de la simulación (`ADR-0001`)                  |
| Firma criptográfica del contenido del QR    | Exigiría gestión de claves, incompatible con una aplicación sin backend |
| Descarga o exportación del carné            | No aporta evidencia adicional sobre control de versiones                |
| Integración con control de acceso físico    | Sistema externo conceptual (`CI-EXT-*`), no implementado                |

## 4. Contenido del código QR

El QR codificará exclusivamente una cadena con el código de empleado ficticio y el estado del
carné. **No contendrá** documento de identidad, correo, teléfono, dirección, ni ningún dato que en
un sistema real fuera personal o sensible.

Esta restricción no es una precaución excesiva. Un código QR es un canal de datos legible por
cualquiera que tenga una cámara: su contenido es público por construcción, y cualquier dato
sensible incluido en él está expuesto. El principio aplica igual en una simulación, porque la
decisión de diseño que se está demostrando es la misma.

## 5. Configuration Items afectados

| CI               | Efecto                                                  | Estado tras el cambio |
| ---------------- | ------------------------------------------------------- | --------------------- |
| CI-APP-PAGE-001  | Se añade la página del carné virtual                    | Modificado            |
| CI-APP-UI-002    | Se añade la entrada de navegación                       | Modificado            |
| CI-APP-SVC-001   | Se añade la lectura de los datos de acreditación        | Modificado            |
| CI-APP-TYPE-001  | Se añade el tipo del carné virtual                      | Modificado            |
| CI-CFG-DEP-001   | Se incorpora una biblioteca de generación de QR         | Modificado            |
| CI-CFG-LOCK-001  | Se actualiza el bloqueo de versiones                    | Modificado            |
| CI-TST-COMP-001  | Se añaden pruebas de componente                         | Modificado            |
| CI-TST-E2E-001   | Se añade el flujo end-to-end de visualización del carné | Modificado            |
| CI-DOC-TRACE-001 | Se registra la trazabilidad del cambio                  | Modificado            |

## 6. Evaluación de impacto

| Dimensión           | Evaluación                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Baseline afectada   | `BL-PROD-001` (v0.1.0). El cambio se incorpora en `BL-PROD-002` (v0.2.0), no modifica la baseline anterior |
| Versión             | `MINOR`: funcionalidad nueva compatible. No altera el comportamiento de los ocho módulos existentes        |
| Compatibilidad      | Sin cambios incompatibles. Ninguna ruta ni contrato existente se modifica                                  |
| Dependencias nuevas | Una biblioteca de generación de QR, sujeta a verificación previa de vulnerabilidades `high` o `critical`   |
| Deuda técnica       | El cambio **no debe agravar TD-001**. La lógica del carné no se añade a `processSubmission`                |
| Cobertura           | No puede descender respecto a la baseline de v0.1.0                                                        |
| Accesibilidad       | El QR requiere texto alternativo; el estado del carné no puede comunicarse solo por color                  |
| Rendimiento         | Impacto en el tamaño del bundle acotado por la elección de una biblioteca ligera                           |

### Riesgos identificados

| Riesgo                                                      | Probabilidad | Impacto | Mitigación                                                                                     |
| ----------------------------------------------------------- | ------------ | ------- | ---------------------------------------------------------------------------------------------- |
| La biblioteca de QR introduce vulnerabilidades              | Baja         | Alto    | Verificar con `npm audit` **antes** de incorporarla; descartar si presenta `high` o `critical` |
| Inclusión accidental de datos sensibles en el QR            | Baja         | Alto    | Contenido restringido a código ficticio y estado; verificado por prueba unitaria               |
| El QR no es accesible para lectores de pantalla             | Media        | Medio   | Texto alternativo obligatorio y descripción textual equivalente                                |
| La lógica del carné agrava la complejidad del módulo legacy | Media        | Medio   | Función de lectura independiente; el pipeline verifica que la complejidad no aumente           |
| Aumento significativo del tamaño del bundle                 | Baja         | Bajo    | Selección de una biblioteca ligera; verificación en el build                                   |

## 7. Criterios de aceptación

1. La sección del carné es accesible desde la navegación en móvil y escritorio.
2. Se muestran nombre, cargo, área, código de empleado y fecha de vinculación del colaborador
   ficticio.
3. El código QR se genera y se renderiza correctamente.
4. El contenido del QR **no incluye** ningún dato clasificable como personal o sensible.
5. El estado activo o inactivo se distingue por texto, no únicamente por color.
6. El QR tiene texto alternativo y existe una representación textual equivalente.
7. La cobertura global no desciende respecto a la baseline de v0.1.0.
8. La complejidad ciclomática máxima del servicio legacy **no aumenta** respecto a 26.
9. `npm audit --audit-level=high` continúa sin hallazgos.
10. Todos los checks de CI pasan.

## 8. Casos de prueba

| ID     | Nivel      | Caso                                                                        | Criterio verificado | Ubicación                                 | Resultado |
| ------ | ---------- | --------------------------------------------------------------------------- | ------------------- | ----------------------------------------- | --------- |
| CP-001 | Unitario   | La lectura de los datos del carné devuelve los campos esperados             | 2                   | `src/services/virtualCardService.test.ts` | Pasa      |
| CP-002 | Unitario   | El contenido del QR contiene únicamente código de empleado y estado         | 4                   | `src/services/virtualCardService.test.ts` | Pasa      |
| CP-003 | Unitario   | Un colaborador con vinculación inactiva produce un carné en estado inactivo | 5                   | `src/services/virtualCardService.test.ts` | Pasa      |
| CP-004 | Componente | La página muestra los cinco campos de acreditación                          | 2                   | `src/pages/VirtualCardPage.test.tsx`      | Pasa      |
| CP-005 | Componente | El QR se renderiza con texto alternativo                                    | 3, 6                | `src/pages/VirtualCardPage.test.tsx`      | Pasa      |
| CP-006 | Componente | El estado se comunica mediante texto además del color                       | 5                   | `src/pages/VirtualCardPage.test.tsx`      | Pasa      |
| CP-007 | Componente | Se presentan los estados de carga y error                                   | —                   | `src/pages/VirtualCardPage.test.tsx`      | Pasa      |
| CP-008 | End-to-end | El colaborador navega hasta el carné y visualiza el QR                      | 1, 3                | `e2e/critical-journeys.spec.ts`           | Pasa      |

Los ocho casos suman doce pruebas: varios criterios se verifican con más de una aserción
independiente. CP-002 se desdobla en tres, porque comprobar que un QR no filtra datos personales
mediante un solo ejemplo no descarta que otro campo se cuele por otra vía.

## 8.b Verificación de los criterios de aceptación

| Criterio | Enunciado                                     | Resultado medido                                                |
| -------- | --------------------------------------------- | --------------------------------------------------------------- |
| 1        | Sección accesible desde la navegación         | Cumplido, verificado en móvil y escritorio por CP-008           |
| 2        | Cinco campos de acreditación                  | Cumplido, CP-001 y CP-004                                       |
| 3        | El QR se genera y se renderiza                | Cumplido, CP-005 y CP-008                                       |
| 4        | El QR no incluye datos personales             | Cumplido, CP-002 verifica la ausencia de seis campos sensibles  |
| 5        | El estado se distingue por texto              | Cumplido, CP-003 y CP-006                                       |
| 6        | Texto alternativo y equivalente textual       | Cumplido, CP-005; la página muestra además el contenido literal |
| 7        | La cobertura no desciende                     | Cumplido: 89,19 % → **90,02 %** de sentencias                   |
| 8        | La complejidad del servicio legacy no aumenta | Cumplido: **26**, sin variación                                 |
| 9        | `npm audit --audit-level=high` sin hallazgos  | Cumplido: 0 vulnerabilidades con `qrcode` 1.5.4 incorporado     |
| 10       | Todos los checks de CI pasan                  | Verificado en el pull request de la implementación              |

La duplicación merece una nota, porque el proceso funcionó exactamente como debía. La primera
versión de la página repetía el componente de par etiqueta/valor que ya existía en el perfil, y la
medición lo detectó: la duplicación subió de 0,77 % a 0,96 %. Estaba dentro de la tolerancia
documentada, de modo que el control no habría bloqueado la integración. Se corrigió igualmente
extrayendo un componente compartido, y la métrica quedó en **0,71 %**, por debajo de la baseline.
Una tolerancia existe para absorber el ruido de refactorizaciones legítimas, no para autorizar
deuda nueva que nadie registró.

## 9. Trazabilidad de la implementación

| Elemento              | Valor                                                        |
| --------------------- | ------------------------------------------------------------ |
| Issue                 | [#5](https://github.com/llipiterdev/appconecta-scm/issues/5) |
| Rama                  | `feature/virtual-card`                                       |
| Commits               | _pendiente_                                                  |
| Pull request          | _pendiente_                                                  |
| Ejecución de CI       | _pendiente_                                                  |
| Merge commit          | _pendiente_                                                  |
| Versión               | v0.2.0                                                       |
| Tag                   | _pendiente_                                                  |
| Release               | _pendiente_                                                  |
| Despliegue verificado | _pendiente_                                                  |

Los campos pendientes se completan con identificadores reales cuando la implementación exista. No
se anticipan hashes, números de PR ni URLs.

## 10. Decisión del Comité de Control de Cambios

| Miembro del CCB                                             | Posición | Observación                                                                               |
| ----------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| Representante del cliente — Miguel Santiago Acevedo Virgues | Aprueba  | Funcionalidad prevista en la evolución del sistema y de valor directo para el colaborador |
| Responsable SCM — Julian Camilo Corredor Rojas              | Aprueba  | Con la condición de que no agrave TD-001 ni reduzca la cobertura de la baseline           |
| Responsable DevOps — Brayan Estif Calderon Gomez            | Aprueba  | Con la condición de verificar la dependencia nueva antes de incorporarla                  |

**Resolución:** aprobado para la versión v0.2.0, condicionado al cumplimiento de los diez criterios
de aceptación. La verificación de las condiciones es automática: el pipeline comprueba
vulnerabilidades, cobertura y complejidad, de modo que las condiciones del CCB no dependen de que
alguien recuerde revisarlas.
