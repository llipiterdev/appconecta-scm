# Convención de mensajes de commit

## Formato

```
<tipo>(<alcance>): <descripción en imperativo>

<cuerpo opcional, líneas de máximo 100 caracteres>

<pie opcional: BREAKING CHANGE, Refs #n, Closes #n>
```

Un mensaje de commit es la única documentación que acompaña a un cambio para siempre. El código
puede reescribirse, la issue puede cerrarse y el pull request puede archivarse, pero el mensaje
permanece unido al diff. Escribirlo bien no es formalismo: es lo que permite que alguien —a
menudo el propio autor meses después— entienda por qué el código es como es.

## Tipos permitidos

| Tipo       | Cuándo se usa                                                 | Efecto en SemVer |
| ---------- | ------------------------------------------------------------- | ---------------- |
| `feat`     | Nueva funcionalidad visible para el usuario                   | `MINOR`          |
| `fix`      | Corrección de un defecto                                      | `PATCH`          |
| `docs`     | Documentación exclusivamente                                  | Ninguno          |
| `test`     | Pruebas: añadidas, corregidas o reorganizadas                 | Ninguno          |
| `refactor` | Cambio de estructura sin alterar el comportamiento observable | Ninguno          |
| `ci`       | Workflows, pipelines y automatización de la plataforma        | Ninguno          |
| `build`    | Sistema de build, dependencias, empaquetado, contenedores     | Ninguno          |
| `chore`    | Tareas de mantenimiento del repositorio                       | Ninguno          |
| `perf`     | Mejora de rendimiento                                         | `PATCH`          |
| `style`    | Formato que no afecta al significado del código               | Ninguno          |

`BREAKING CHANGE` en el pie del mensaje fuerza un incremento `MAJOR`, sea cual sea el tipo.

## Alcances usados en el proyecto

| Alcance        | Área que designa                                   |
| -------------- | -------------------------------------------------- |
| `project`      | Estructura y configuración general del repositorio |
| `portal`       | Aplicación del colaborador en su conjunto          |
| `ui`           | Primitivas de interfaz reutilizables               |
| `documents`    | Módulo de documentos laborales                     |
| `payroll`      | Módulo de desprendibles de nómina                  |
| `hr`           | Solicitudes de Recursos Humanos e incapacidades    |
| `identity`     | Perfil del colaborador y carné virtual             |
| `integrations` | Adaptadores de sistemas simulados                  |
| `quality`      | Lint, formato, verificación de tipos               |
| `commits`      | Convención de commits y hooks                      |
| `container`    | Imagen de Docker                                   |
| `deploy`       | Despliegue y GitHub Pages                          |
| `release`      | Preparación de una versión                         |
| `scm`          | Gobierno de configuración                          |
| `debt`         | Registro de deuda técnica                          |
| `evidence`     | Recopilación de evidencias                         |
| `merge`        | Commits de integración de pull request             |

## Reglas verificadas automáticamente

`.commitlintrc.json` aplica la configuración convencional estándar con estos ajustes:

| Regla                                  | Valor     | Razón                                                                                    |
| -------------------------------------- | --------- | ---------------------------------------------------------------------------------------- |
| Tipo obligatorio y dentro del catálogo | Error     | Un tipo libre haría imposible derivar la versión y agrupar el changelog                  |
| Longitud máxima del encabezado         | 100       | Legible en cualquier vista de historial sin truncamiento                                 |
| Longitud máxima de línea del cuerpo    | 100       | Legible en terminal y en la interfaz de GitHub sin desplazamiento horizontal             |
| Encabezado sin punto final             | Error     | Consistencia del historial                                                               |
| Descripción no vacía                   | Error     | Un commit sin descripción no documenta nada                                              |
| Mayúsculas y minúsculas del asunto     | Sin regla | Las descripciones incluyen nombres propios (`AppConecta`, `GitHub`) que exigen mayúscula |

La validación ocurre en dos momentos independientes:

1. **Local**, mediante el hook `commit-msg` de Husky. Impide crear el commit incorrecto.
2. **En CI**, mediante el job de validación de mensajes en cada pull request. Impide que un
   commit incorrecto llegue a una rama permanente aunque los hooks locales estén desactivados.
   El job distingue commits ordinarios de commits de merge, por la razón que se explica en
   [Alcance de la validación sobre los commits de merge](#alcance-de-la-validación-sobre-los-commits-de-merge).

El segundo control existe porque el primero puede saltarse con `--no-verify`. Una validación que
solo vive en la máquina del desarrollador es una recomendación, no un control.

## Ejemplos del historial real del proyecto

```
chore(project): scaffold AppConecta simulation
build(tooling): add eslint prettier and vitest configuration
chore(commits): add commitlint and husky hooks
ci(quality): add pull request validation
feat(ui): add accessible interface primitives
feat(portal): add responsive application shell
build(pwa): add web app manifest and service worker
test(portal): cover application shell and routing
feat(integrations): add mock corporate system contracts
feat(portal): add legacy employee service with intentional debt
feat(portal): add employee modules for the collaborator portal
test(portal): cover critical employee journeys
docs(debt): register intentional technical debt
```

Los mensajes de commit se escriben en **inglés**, igual que el código y los identificadores. La
documentación, la interfaz de la aplicación y los pull requests están en **español**.

## Cuerpo del mensaje

El cuerpo es opcional, pero se usa cuando el cambio requiere justificación que el diff no muestra:
por qué se tomó esa decisión, qué alternativa se descartó, qué deuda se introduce
deliberadamente.

```
feat(portal): add legacy employee service with intentional debt

Concentra deliberadamente persistencia, validacion, transformacion y
reglas de negocio en un unico modulo para materializar TD-001 y TD-005.

Refs #2
Refs #9
```

Referencias en el pie:

| Palabra clave | Efecto                                      |
| ------------- | ------------------------------------------- |
| `Refs #n`     | Vincula el commit con la issue sin cerrarla |
| `Closes #n`   | Cierra la issue automáticamente al integrar |

## Excepción histórica documentada

El commit inicial del repositorio es:

```
114e7b2 chore(project): initialize AppConecta SCM repository
```

Este commit **precede a la adopción de la convención**: se creó antes de que existiera
`.commitlintrc.json` y antes de que los hooks estuvieran instalados. Cumple el formato por
coincidencia, no por validación.

Se conserva sin reescribir, conforme a la regla de no alterar el historial publicado. Reescribirlo
para que "pareciera" validado sería exactamente el tipo de falsificación que el proyecto se
compromete a no hacer, y a cambio de nada: el historial es más honesto declarando la excepción que
ocultándola.

Todos los commits posteriores a `59b3f1a chore(project): scaffold AppConecta simulation` están
validados por commitlint tanto en local como en CI.

## Commits de integración

Los merge commits de pull request siguen la misma convención:

```
chore(merge): integrate employee modules and intentional debt (#12)
```

El número de pull request entre paréntesis permite localizar, desde el historial de `develop`, la
discusión y la evaluación de impacto que autorizaron esa integración. Es el enlace entre el
historial de Git y el proceso de control de cambios.

### Alcance de la validación sobre los commits de merge

De los commits de merge se valida **la cabecera, no el cuerpo**. La distinción no es una excepción
de conveniencia y conviene explicar de dónde salió.

Los cinco primeros merge commits se integraron con un cuerpo escrito en una sola línea larga, que
incumple `body-max-line-length`. El incumplimiento no apareció al fusionar hacia `develop`, porque
allí el rango validado solo contiene los commits de la rama de trabajo; apareció en el primer pull
request hacia `main`, cuyo rango sí incluye los merges anteriores.

Llegado ese punto quedaban dos salidas. Reescribir los cinco mensajes habría exigido `push --force`
sobre ramas permanentes ya publicadas, que es precisamente la operación que
[`docs/git-workflow.md`](git-workflow.md) prohíbe y sobre la que descansa la estabilidad de las
baselines: un tag o un commit que hoy apunta a un contenido distinto del de ayer destruye la
trazabilidad que el proyecto pretende demostrar. La otra salida, la adoptada, es acotar la
validación a lo que quien integra controla de verdad.

La cabecera se sigue exigiendo completa. Es la parte que determina el tipo, el alcance y la
versión, y es la que se escribe deliberadamente. El cuerpo de un merge lo compone la plataforma en
el momento de la integración.

El control no se relajó para conseguir un pipeline verde: los commits ordinarios, que son 29 de los
34 del historial, se siguen validando con el reglamento íntegro. Los merges posteriores a esta
decisión se redactan ya con el cuerpo ajustado a 100 columnas.
