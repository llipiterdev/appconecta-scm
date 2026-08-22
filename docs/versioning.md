# Versionamiento semántico — AppConecta

## Esquema

```
MAJOR.MINOR.PATCH
```

| Componente | Se incrementa cuando                                        | Efecto sobre quien consume el software                     |
| ---------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| `MAJOR`    | Se introduce un cambio incompatible con la versión anterior | Requiere intervención: algo que funcionaba deja de hacerlo |
| `MINOR`    | Se añade funcionalidad de forma compatible                  | Puede actualizar sin cambios; gana capacidades             |
| `PATCH`    | Se corrige un defecto de forma compatible                   | Puede actualizar sin cambios; el comportamiento mejora     |

La regla que hace útil el esquema es la que se enuncia desde el punto de vista de quien recibe la
versión, no de quien la produce: **el número no describe cuánto trabajo costó el cambio, sino
cuánto riesgo asume quien actualiza.**

## Correspondencia con los tipos de commit

| Tipo de commit                                  | Incremento        | Motivo                                       |
| ----------------------------------------------- | ----------------- | -------------------------------------------- |
| `fix`                                           | `PATCH`           | Corrección compatible                        |
| `feat`                                          | `MINOR`           | Funcionalidad nueva compatible               |
| Cualquier tipo con `BREAKING CHANGE`            | `MAJOR`           | Incompatibilidad, con independencia del tipo |
| `perf`                                          | `PATCH`           | Mejora sin cambio de contrato                |
| `refactor`                                      | Ninguno o `PATCH` | Sin cambio de comportamiento observable      |
| `docs`, `ci`, `build`, `chore`, `test`, `style` | Ninguno           | No alteran el software entregado al usuario  |

Sobre la última fila: un cambio exclusivamente documental o de pipeline **no obliga por sí mismo**
a incrementar la versión funcional. La documentación y la automatización se versionan junto con la
entrega en la que se incorporan, no como versiones propias. Emitir una versión nueva por corregir
una errata en el README degradaría el significado del número.

## Estado de versiones inferiores a 1.0.0

El proyecto se encuentra en el rango `0.y.z`. Según la especificación de versionamiento semántico,
la API pública no se considera estable en este rango y los incrementos `MINOR` pueden incluir
cambios incompatibles.

**No se creará `v1.0.0` en esta actividad.** La razón no es prudencia genérica: `v1.0.0`
significaría declarar estable una arquitectura que contiene deuda estructural deliberada y
pendiente de intervención. La versión `1.0.0` tendrá sentido cuando la refactorización de la
Actividad 4 esté completada y la estructura sea la que el proyecto pretende sostener.

## Versiones planificadas

| Versión       | Tipo       | Contenido                                                                      | Baseline asociada |
| ------------- | ---------- | ------------------------------------------------------------------------------ | ----------------- |
| `0.1.0-dev`   | Desarrollo | Valor en `package.json` durante el desarrollo previo a la primera entrega      | —                 |
| `v0.1.0-rc.1` | Candidata  | Código candidato a la primera entrega, verificado por el pipeline completo     | `BL-DEV-001`      |
| `v0.1.0`      | `MINOR`    | Primera baseline funcional: ocho módulos del portal, deuda medida, pipeline CI | `BL-PROD-001`     |
| `v0.2.0-rc.1` | Candidata  | Código candidato a la segunda entrega                                          | `BL-DEV-002`      |
| `v0.2.0`      | `MINOR`    | Carné virtual QR, modelo SCM implementado, CI/CD funcional                     | `BL-PROD-002`     |

Ambas entregas son `MINOR` porque incorporan funcionalidad nueva de forma compatible. El carné
virtual añade una sección al portal sin alterar el comportamiento de las ocho existentes.

## Tags

Todos los tags de versión son **anotados**, nunca ligeros:

```bash
git tag -a v0.1.0 -m "Version 0.1.0 - primera baseline funcional de AppConecta"
```

Un tag anotado es un objeto propio de Git con autor, fecha y mensaje, y por tanto un artefacto
auditable. Un tag ligero es solo un puntero: no registra quién lo creó ni cuándo, que es
precisamente la información que una baseline necesita.

**Formato:** `vMAJOR.MINOR.PATCH` para versiones liberadas; `vMAJOR.MINOR.PATCH-rc.N` para
candidatas.

**Reglas:**

- Un tag publicado nunca se mueve ni se elimina. Un tag que hoy apunta a un commit distinto del de
  ayer destruye la propiedad que justifica la existencia de las baselines.
- Los tags de versión se crean sobre `main`, después de fusionar la rama de release.
- El pipeline de release valida que el tag coincida con el campo `version` de `package.json` y
  falla si difieren.

## Coherencia entre el tag y `package.json`

La versión vive en dos lugares que pueden desincronizarse: el campo `version` de `package.json` y
el tag de Git. La verificación es automática y bloqueante en el workflow de release:

| Situación                                    | Resultado del pipeline |
| -------------------------------------------- | ---------------------- |
| Tag `v0.1.0` y `package.json` en `0.1.0`     | Continúa               |
| Tag `v0.1.0` y `package.json` en `0.1.0-dev` | **Falla**              |
| Tag con formato distinto de `vX.Y.Z`         | **Falla**              |

Se automatiza porque es el error más fácil de cometer y el más difícil de detectar después: una
imagen de contenedor etiquetada `0.1.0` que internamente reporta `0.1.0-dev` es una baseline
inconsistente, y nada en la operación normal lo evidencia.

## Ciclo de la versión en `package.json`

| Momento                                 | Valor de `version` |
| --------------------------------------- | ------------------ |
| Desarrollo en `develop`                 | `0.1.0-dev`        |
| Al crear `release/0.1.0`                | `0.1.0`            |
| Tras reintegrar la release en `develop` | `0.2.0-dev`        |

El sufijo `-dev` cumple una función concreta: hace imposible confundir un build de desarrollo con
una versión liberada, tanto en la interfaz de la aplicación como en los artefactos generados.

## Registro de versiones publicadas

| Versión                       | Fecha | Commit de `main` | Tag | Release | Despliegue |
| ----------------------------- | ----- | ---------------- | --- | ------- | ---------- |
| _(ninguna publicada todavía)_ |       |                  |     |         |            |

La tabla se completa cuando cada versión existe. No se anticipan fechas ni hashes.
