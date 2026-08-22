# AppConecta — Gestión de Configuración y Mantenimiento de Software

Repositorio del proyecto integrador de la asignatura **Gestión de Configuración y
Mantenimiento de Software** (Maestría en Ingeniería de Software, Universidad de La Sabana).

## Aviso de alcance: esta es una simulación académica

**AppConecta, tal como existe en este repositorio, es una simulación funcional con
propósito académico.** No es una aplicación legacy real, no ha estado diez años en
producción y no contiene datos reales de ninguna organización.

Los diagnósticos de las Actividades 1 y 2 describen AppConecta como una aplicación móvil
corporativa con aproximadamente diez años de operación sin mantenimiento significativo.
Ese escenario es un **supuesto académico heredado** de dichos documentos, autorizado por el
docente del curso, y no una afirmación sobre hechos reales:

- No existen diez años reales de commits en este repositorio.
- No se han retrocedido ni falsificado fechas de Git.
- No se han fabricado incidentes, vulnerabilidades históricas ni métricas.
- Todas las integraciones con sistemas corporativos (nómina, RRHH, autenticación,
  base de datos) son **simuladas mediante mocks y datos ficticios**.
- Los datos de colaborador, documentos, nómina y anuncios son **completamente ficticios**.

La aplicación de este repositorio es una **Progressive Web App** que representa
académicamente el cliente móvil de AppConecta, para poder evidenciar de forma verificable
una estrategia de control de versiones, gestión de configuración y automatización DevOps.

## Documentación

### Gestión de configuración

| Documento                                                    | Contenido                                                  |
| ------------------------------------------------------------ | ---------------------------------------------------------- |
| [Configuration Items](docs/configuration-items.md)           | Inventario de los 66 CI con sus diez atributos             |
| [Baselines](docs/baselines.md)                               | Baselines funcional, de diseño, de desarrollo y productiva |
| [Control de cambios](docs/change-control.md)                 | Proceso, niveles de cambio y registro administrativo       |
| [Matriz de trazabilidad](docs/traceability-matrix.md)        | De requisito a despliegue, con identificadores reales      |
| [Roles y RACI](docs/raci.md)                                 | Estructura organizacional y responsabilidades              |
| [Registro de deuda técnica](docs/technical-debt-register.md) | TD-001 a TD-009 con baseline medida                        |

### Control de versiones

| Documento                                             | Contenido                              |
| ----------------------------------------------------- | -------------------------------------- |
| [Estrategia de ramas](docs/git-workflow.md)           | GitFlow liviano y su justificación     |
| [Versionamiento semántico](docs/versioning.md)        | Política SemVer, tags y releases       |
| [Convención de commits](docs/conventional-commits.md) | Conventional Commits y su verificación |
| [Guía de contribución](CONTRIBUTING.md)               | Cómo trabajar en el repositorio        |

### Arquitectura y decisiones

| Documento                                     | Contenido                                |
| --------------------------------------------- | ---------------------------------------- |
| [Arquitectura](docs/architecture.md)          | Componentes, capas y despliegue          |
| [ADR-0001](docs/adr/0001-simulation-scope.md) | Alcance simulado del sistema             |
| [ADR-0002](docs/adr/0002-gitflow-strategy.md) | GitFlow liviano como estrategia de ramas |
| [ADR-0003](docs/adr/0003-ci-cd-platform.md)   | GitHub Actions, Pages y GHCR             |
| [RFC-001](docs/rfc/RFC-001-virtual-card.md)   | Carné virtual QR del colaborador         |

### Contexto académico

| Documento                                       | Contenido                                |
| ----------------------------------------------- | ---------------------------------------- |
| [Unidad 1](docs/unidad-1/analisis-evolucion.md) | Evolución, deuda técnica y mantenimiento |
| [Unidad 2](docs/unidad-2/estrategia-scm.md)     | Estrategia de gestión de configuración   |

## Estado

Baseline de diseño establecida. El pipeline de CI completo, la automatización de despliegue y
las versiones v0.1.0 y v0.2.0 se incorporan en las fases siguientes.

## Integrantes

- Miguel Santiago Acevedo Virgues
- Julian Camilo Corredor Rojas
- Brayan Estif Calderon Gomez

Docente: Cesar Augusto Vega Fernandez

## Licencia

[MIT](LICENSE)
