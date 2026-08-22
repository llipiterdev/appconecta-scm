# Inventario de Configuration Items — AppConecta

Un Configuration Item (CI) es un elemento del proyecto sometido a identificación, control de
cambios y trazabilidad. Este inventario materializa en el repositorio la identificación de CI
definida en la Actividad 2.

## Regla de honestidad de este inventario

El inventario distingue dos naturalezas y **nunca las confunde**:

- **CI implementados** — existen como artefactos verificables en el repositorio o en la
  plataforma. Se pueden abrir, ejecutar o consultar.
- **CI conceptuales o simulados** — pertenecen al diagnóstico de AppConecta como sistema, pero
  **no están implementados** en esta simulación. Aparecen porque el modelo SCM debe reconocer
  su existencia y sus dependencias, no porque se hayan construido.

Presentar un CI conceptual como implementado invalidaría el inventario completo. Cada fila
declara su naturaleza en la columna **Estado**.

## Atributos registrados

Cada CI se registra con los diez atributos definidos en la estrategia SCM de la Actividad 2:

| Atributo             | Significado                                              |
| -------------------- | -------------------------------------------------------- |
| ID                   | Identificador único y estable del CI                     |
| Nombre               | Denominación funcional                                   |
| Categoría            | Naturaleza del artefacto                                 |
| Propietario          | Rol responsable de autorizar y verificar cambios         |
| Estado               | Implementado, conceptual o pendiente                     |
| Versión              | Versión o baseline en que el CI alcanza su estado actual |
| Ubicación            | Ruta en el repositorio o localización en la plataforma   |
| Dependencias         | CI de los que depende                                    |
| Criticidad           | Efecto de un cambio defectuoso sobre el sistema          |
| Método de aprobación | Mecanismo por el que se autoriza un cambio               |

## Nomenclatura de identificadores

`CI-<ÁMBITO>-<TIPO>-<NNN>`

| Ámbito | Significado                        |
| ------ | ---------------------------------- |
| `APP`  | Código y artefactos de aplicación  |
| `CFG`  | Configuración técnica del proyecto |
| `TST`  | Pruebas automatizadas              |
| `PIPE` | Automatización CI/CD               |
| `DOC`  | Documentación y gobierno           |
| `REL`  | Artefactos de entrega              |
| `EXT`  | Sistemas externos (conceptuales)   |

---

## 1. Aplicación

| ID               | Nombre                               | Categoría     | Propietario  | Estado       | Versión | Ubicación                                | Dependencias                     | Criticidad  | Aprobación             |
| ---------------- | ------------------------------------ | ------------- | ------------ | ------------ | ------- | ---------------------------------------- | -------------------------------- | ----------- | ---------------------- |
| CI-APP-CODE-001  | Código React de la aplicación        | Código fuente | Desarrollo   | Implementado | v0.1.0  | `src/app/`, `src/main.tsx`               | CI-CFG-VITE-001, CI-CFG-TS-001   | Alta        | PR + CI                |
| CI-APP-UI-001    | Primitivas de interfaz accesibles    | Componentes   | Desarrollo   | Implementado | v0.1.0  | `src/components/ui/`                     | CI-CFG-STYLE-001                 | Media       | PR + CI                |
| CI-APP-UI-002    | Shell y navegación responsive        | Componentes   | Desarrollo   | Implementado | v0.1.0  | `src/components/layout/`                 | CI-APP-UI-001, CI-APP-CODE-001   | Alta        | PR + CI                |
| CI-APP-UI-003    | Estados de carga, vacío y error      | Componentes   | Desarrollo   | Implementado | v0.1.0  | `src/components/feedback/`               | CI-APP-UI-001                    | Media       | PR + CI                |
| CI-APP-PAGE-001  | Páginas funcionales del portal       | Componentes   | Desarrollo   | Implementado | v0.1.0  | `src/pages/`                             | CI-APP-SVC-001, CI-APP-UI-002    | Alta        | PR + CI                |
| CI-APP-SVC-001   | Servicio del portal (módulo legacy)  | Servicio      | Desarrollo   | Implementado | v0.1.0  | `src/services/legacyEmployeeService.ts`  | CI-APP-SVC-002, CI-APP-STORE-001 | **Crítica** | PR + CI + revisión SCM |
| CI-APP-SVC-002   | Adaptadores de integración simulados | Servicio      | Desarrollo   | Implementado | v0.1.0  | `src/services/mockIntegrations.ts`       | CI-APP-TYPE-001                  | Alta        | PR + CI                |
| CI-APP-STORE-001 | Persistencia local del navegador     | Datos         | Desarrollo   | Implementado | v0.1.0  | `window.localStorage` vía CI-APP-SVC-001 | CI-APP-SVC-001                   | Media       | PR + CI                |
| CI-APP-TYPE-001  | Modelo de tipos del dominio          | Código fuente | Arquitectura | Implementado | v0.1.0  | `src/types/domain.ts`                    | —                                | Alta        | PR + CI                |
| CI-APP-HOOK-001  | Hook de carga asíncrona              | Código fuente | Desarrollo   | Implementado | v0.1.0  | `src/hooks/useAsyncResource.ts`          | —                                | Media       | PR + CI                |
| CI-APP-PWA-001   | Manifiesto PWA y service worker      | Configuración | DevOps       | Implementado | v0.1.0  | `vite.config.ts`, `public/`              | CI-CFG-VITE-001                  | Media       | PR + CI                |

`CI-APP-SVC-001` es el único CI de criticidad **crítica** del inventario, y no por su tamaño:
concentra las deudas TD-001 a TD-005 y TD-008, y es el punto por el que pasan los ocho módulos
del portal. Un defecto introducido allí se propaga simultáneamente a documentos, nómina,
solicitudes e incapacidades. Es también el CI objeto de la intervención de la Actividad 4.

## 2. Configuración técnica

| ID                | Nombre                                   | Categoría     | Propietario     | Estado       | Versión | Ubicación                                              | Dependencias    | Criticidad  | Aprobación |
| ----------------- | ---------------------------------------- | ------------- | --------------- | ------------ | ------- | ------------------------------------------------------ | --------------- | ----------- | ---------- |
| CI-CFG-VITE-001   | Configuración de build (Vite)            | Configuración | DevOps          | Implementado | v0.1.0  | `vite.config.ts`                                       | CI-CFG-DEP-001  | Alta        | PR + CI    |
| CI-CFG-TS-001     | Configuración de TypeScript              | Configuración | Desarrollo      | Implementado | v0.1.0  | `tsconfig*.json`                                       | CI-CFG-DEP-001  | Alta        | PR + CI    |
| CI-CFG-LINT-001   | Configuración de ESLint                  | Configuración | Revisión        | Implementado | v0.1.0  | `eslint.config.js`                                     | CI-CFG-DEP-001  | Media       | PR + CI    |
| CI-CFG-LINT-002   | Configuración de medición de complejidad | Configuración | Responsable SCM | Implementado | v0.1.0  | `eslint.metrics.config.js`                             | CI-CFG-LINT-001 | Media       | PR + CI    |
| CI-CFG-STYLE-001  | Configuración de formato y estilos       | Configuración | Revisión        | Implementado | v0.1.0  | `.prettierrc.json`, `.prettierignore`, `src/index.css` | CI-CFG-DEP-001  | Baja        | PR + CI    |
| CI-CFG-TEST-001   | Configuración de pruebas (Vitest)        | Configuración | Revisión        | Implementado | v0.1.0  | `vitest.config.ts`, `src/test/setup.ts`                | CI-CFG-DEP-001  | Alta        | PR + CI    |
| CI-CFG-DUP-001    | Configuración de análisis de duplicación | Configuración | Responsable SCM | Implementado | v0.1.0  | `.jscpd.json`                                          | CI-CFG-DEP-001  | Baja        | PR + CI    |
| CI-CFG-COMMIT-001 | Configuración de commitlint y hooks      | Configuración | Responsable SCM | Implementado | v0.1.0  | `.commitlintrc.json`, `.husky/`                        | CI-CFG-DEP-001  | Media       | PR + CI    |
| CI-CFG-DEP-001    | Declaración de dependencias              | Configuración | DevOps          | Implementado | v0.1.0  | `package.json`                                         | —               | **Crítica** | PR + CI    |
| CI-CFG-LOCK-001   | Bloqueo de versiones exactas             | Configuración | DevOps          | Implementado | v0.1.0  | `package-lock.json`                                    | CI-CFG-DEP-001  | **Crítica** | PR + CI    |
| CI-CFG-NODE-001   | Versión de Node declarada                | Configuración | DevOps          | Implementado | v0.1.0  | `.nvmrc`, campo `engines`                              | —               | Alta        | PR + CI    |
| CI-CFG-ENV-001    | Plantilla de variables de entorno        | Configuración | DevOps          | Implementado | v0.1.0  | `.env.example`                                         | —               | Baja        | PR + CI    |

`CI-CFG-LOCK-001` es crítico por una razón que suele pasarse por alto: es el único artefacto que
garantiza que el build de hoy y el de la Actividad 4 usen exactamente las mismas versiones. Sin
él, una comparación de métricas antes/después no distinguiría el efecto de la refactorización del
efecto de una actualización de dependencias.

## 3. Pruebas

| ID               | Nombre                                | Categoría | Propietario | Estado       | Versión | Ubicación                                              | Dependencias                    | Criticidad | Aprobación |
| ---------------- | ------------------------------------- | --------- | ----------- | ------------ | ------- | ------------------------------------------------------ | ------------------------------- | ---------- | ---------- |
| CI-TST-UNIT-001  | Pruebas unitarias del servicio        | Pruebas   | Revisión    | Implementado | v0.1.0  | `src/services/*.test.ts`                               | CI-APP-SVC-001, CI-CFG-TEST-001 | Alta       | PR + CI    |
| CI-TST-COMP-001  | Pruebas de componentes y páginas      | Pruebas   | Revisión    | Implementado | v0.1.0  | `src/pages/*.test.tsx`, `src/components/**/*.test.tsx` | CI-APP-PAGE-001                 | Alta       | PR + CI    |
| CI-TST-ROUTE-001 | Pruebas de enrutamiento y shell       | Pruebas   | Revisión    | Implementado | v0.1.0  | `src/app/routes.test.tsx`                              | CI-APP-UI-002                   | Media      | PR + CI    |
| CI-TST-UTIL-001  | Utilidades de prueba                  | Pruebas   | Revisión    | Implementado | v0.1.0  | `src/test/`                                            | CI-CFG-TEST-001                 | Media      | PR + CI    |
| CI-TST-E2E-001   | Pruebas end-to-end de flujos críticos | Pruebas   | Revisión    | Implementado | v0.1.0  | `e2e/`, `playwright.config.ts`                         | CI-APP-PAGE-001                 | Alta       | PR + CI    |

## 4. Automatización CI/CD

| ID                 | Nombre                               | Categoría                   | Propietario     | Estado       | Versión | Ubicación                                                     | Dependencias                   | Criticidad  | Aprobación                       |
| ------------------ | ------------------------------------ | --------------------------- | --------------- | ------------ | ------- | ------------------------------------------------------------- | ------------------------------ | ----------- | -------------------------------- |
| CI-PIPE-CI-001     | Pipeline de integración continua     | Automatización              | DevOps          | Implementado | v0.1.0  | `.github/workflows/ci.yml`                                    | CI-CFG-DEP-001, CI-TST-*       | **Crítica** | PR + CI                          |
| CI-PIPE-CD-001     | Pipeline de despliegue a Pages       | Automatización              | DevOps          | Pendiente    | v0.2.0  | `.github/workflows/deploy.yml`                                | CI-PIPE-CI-001                 | Alta        | PR + CI                          |
| CI-PIPE-REL-001    | Pipeline de release por tag          | Automatización              | DevOps          | Pendiente    | v0.2.0  | `.github/workflows/release.yml`                               | CI-PIPE-CI-001, CI-REL-IMG-001 | Alta        | PR + CI                          |
| CI-PIPE-DOCKER-001 | Definición de imagen de producción   | Automatización              | DevOps          | Implementado | v0.1.0  | `Dockerfile`, `.dockerignore`, `docker/nginx.conf`            | CI-CFG-VITE-001                | Alta        | PR + CI                          |
| CI-PIPE-METRIC-001 | Scripts de medición de métricas      | Automatización              | Responsable SCM | Implementado | v0.1.0  | `scripts/metrics-complexity.mjs`                              | CI-CFG-LINT-002                | Media       | PR + CI                          |
| CI-PIPE-EVID-001   | Script de recopilación de evidencias | Automatización              | Responsable SCM | Implementado | v0.1.0  | `scripts/collect-evidence.mjs`                                | CI-PIPE-CI-001                 | Media       | PR + CI                          |
| CI-PIPE-GATE-001   | Control de no regresión de métricas  | Automatización              | Responsable SCM | Implementado | v0.1.0  | `scripts/metrics-gate.mjs`, `metrics-baseline.json`           | CI-PIPE-METRIC-001             | **Crítica** | PR + CI                          |
| CI-PIPE-DEP-001    | Configuración de Dependabot          | Automatización              | DevOps          | Implementado | v0.1.0  | `.github/dependabot.yml`                                      | CI-CFG-DEP-001                 | Baja        | PR + CI                          |
| CI-PIPE-RULE-001   | Rulesets de protección de ramas      | Configuración de plataforma | Responsable SCM | Implementado | v0.1.0  | Rulesets 21182905 y 21182906                                  | CI-PIPE-CI-001                 | **Crítica** | Cambio administrativo registrado |
| CI-PIPE-TMPL-001   | Plantillas de issues y pull request  | Configuración de plataforma | Responsable SCM | Implementado | v0.1.0  | `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md` | —                              | Media       | PR + CI                          |
| CI-PIPE-OWN-001    | Asignación de propiedad de código    | Configuración de plataforma | Responsable SCM | Implementado | v0.1.0  | `CODEOWNERS`                                                  | —                              | Media       | PR + CI                          |

`CI-PIPE-RULE-001` es el único CI cuyo método de aprobación no es un pull request, porque los
rulesets no viven en el árbol de archivos. Se registra como cambio administrativo documentado en
`docs/change-control.md`, con el identificador del ruleset como evidencia verificable.

## 5. Documentación y gobierno

| ID                 | Nombre                                     | Categoría          | Propietario                  | Estado       | Versión | Ubicación                                               | Criticidad  | Aprobación |
| ------------------ | ------------------------------------------ | ------------------ | ---------------------------- | ------------ | ------- | ------------------------------------------------------- | ----------- | ---------- |
| CI-DOC-README-001  | Presentación del repositorio               | Documentación      | Líder de consultoría         | Implementado | v0.1.0  | `README.md`                                             | Media       | PR + CI    |
| CI-DOC-ARCH-001    | Documento de arquitectura                  | Documentación      | Arquitectura                 | Implementado | v0.1.0  | `docs/architecture.md`                                  | Alta        | PR + CI    |
| CI-DOC-CI-001      | Inventario de Configuration Items          | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/configuration-items.md`                           | **Crítica** | PR + CI    |
| CI-DOC-BASE-001    | Definición de baselines                    | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/baselines.md`                                     | **Crítica** | PR + CI    |
| CI-DOC-CHG-001     | Proceso de control de cambios              | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/change-control.md`                                | **Crítica** | PR + CI    |
| CI-DOC-FLOW-001    | Estrategia de ramas                        | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/git-workflow.md`                                  | Alta        | PR + CI    |
| CI-DOC-VER-001     | Política de versionamiento semántico       | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/versioning.md`                                    | Alta        | PR + CI    |
| CI-DOC-COMMIT-001  | Convención de mensajes de commit           | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/conventional-commits.md`                          | Media       | PR + CI    |
| CI-DOC-TRACE-001   | Matriz de trazabilidad                     | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/traceability-matrix.md`                           | **Crítica** | PR + CI    |
| CI-DOC-RACI-001    | Roles, responsabilidades y RACI            | Documentación      | Líder de consultoría         | Implementado | v0.1.0  | `docs/raci.md`                                          | Media       | PR + CI    |
| CI-DOC-DEBT-001    | Registro de deuda técnica                  | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/technical-debt-register.md`                       | **Crítica** | PR + CI    |
| CI-DOC-CICD-001    | Documentación de CI/CD                     | Documentación      | DevOps                       | Implementado | v0.1.0  | `docs/ci-cd.md`                                         | Alta        | PR + CI    |
| CI-DOC-MAINT-001   | Baseline de mantenimiento para Actividad 4 | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/maintenance-baseline.md`                          | **Crítica** | PR + CI    |
| CI-DOC-CONTRIB-001 | Guía de contribución                       | Documentación      | Líder de consultoría         | Implementado | v0.1.0  | `CONTRIBUTING.md`                                       | Media       | PR + CI    |
| CI-DOC-AGENT-001   | Instrucciones para agentes de código       | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `AGENTS.md`                                             | Baja        | PR + CI    |
| CI-DOC-RFC-001     | RFC-001 Carné virtual QR                   | Control de cambios | Comité de Control de Cambios | Implementado | v0.1.0  | `docs/rfc/RFC-001-virtual-card.md`                      | Alta        | PR + CI    |
| CI-DOC-ADR-001     | Decisiones de arquitectura registradas     | Documentación      | Arquitectura                 | Implementado | v0.1.0  | `docs/adr/`                                             | Alta        | PR + CI    |
| CI-DOC-U1-001      | Análisis de evolución y deuda (Unidad 1)   | Documentación      | Líder de consultoría         | Implementado | v0.1.0  | `docs/unidad-1/analisis-evolucion.md`                   | Media       | PR + CI    |
| CI-DOC-U2-001      | Estrategia SCM (Unidad 2)                  | Documentación      | Responsable SCM              | Implementado | v0.1.0  | `docs/unidad-2/estrategia-scm.md`                       | Media       | PR + CI    |
| CI-DOC-U3-001      | Informe de la Actividad 3                  | Documentación      | Líder de consultoría         | Pendiente    | v0.2.0  | `docs/unidad-3/actividad-3-control-versiones-devops.md` | **Crítica** | PR + CI    |
| CI-DOC-EVID-001    | Registro de evidencias                     | Documentación      | Responsable SCM              | Pendiente    | v0.2.0  | `docs/evidencias/`                                      | Alta        | PR + CI    |
| CI-DOC-LIC-001     | Licencia                                   | Documentación      | Líder de consultoría         | Implementado | v0.1.0  | `LICENSE`                                               | Baja        | PR + CI    |

## 6. Artefactos de entrega

| ID               | Nombre                           | Categoría | Propietario     | Estado    | Versión | Ubicación                                 | Dependencias       | Criticidad  | Aprobación                         |
| ---------------- | -------------------------------- | --------- | --------------- | --------- | ------- | ----------------------------------------- | ------------------ | ----------- | ---------------------------------- |
| CI-REL-CHG-001   | Registro de cambios              | Entrega   | Responsable SCM | Pendiente | v0.1.0  | `CHANGELOG.md`                            | —                  | Alta        | PR + CI                            |
| CI-REL-TAG-001   | Tags anotados de versión         | Entrega   | Responsable SCM | Pendiente | v0.1.0  | Tags `v*.*.*` del repositorio             | CI-REL-CHG-001     | **Crítica** | Merge a `main` + validación SemVer |
| CI-REL-DIST-001  | Artefacto de build de producción | Entrega   | DevOps          | Pendiente | v0.1.0  | Artefacto `dist/` del workflow            | CI-PIPE-CI-001     | Alta        | Pipeline                           |
| CI-REL-IMG-001   | Imagen de contenedor             | Entrega   | DevOps          | Pendiente | v0.2.0  | GHCR `ghcr.io/llipiterdev/appconecta-scm` | CI-PIPE-DOCKER-001 | Alta        | Pipeline por tag                   |
| CI-REL-PAGES-001 | Despliegue público de la PWA     | Entrega   | DevOps          | Pendiente | v0.2.0  | GitHub Pages del repositorio              | CI-PIPE-CD-001     | Alta        | Pipeline + smoke test              |
| CI-REL-GH-001    | GitHub Releases                  | Entrega   | Responsable SCM | Pendiente | v0.1.0  | Releases del repositorio                  | CI-REL-TAG-001     | Alta        | Merge a `main`                     |

---

## 7. Configuration Items conceptuales — **no implementados**

Los siguientes CI pertenecen al modelo de AppConecta como sistema corporativo descrito en las
Actividades 1 y 2. **Ninguno existe en este repositorio.** Se registran porque el modelo SCM debe
reconocer las dependencias externas del sistema, y porque su ausencia explica el alcance de la
simulación.

| ID                 | Nombre                                 | Naturaleza en esta simulación                                                    | Propietario conceptual | Estado         | Criticidad conceptual |
| ------------------ | -------------------------------------- | -------------------------------------------------------------------------------- | ---------------------- | -------------- | --------------------- |
| CI-EXT-PAY-001     | API del sistema de nómina              | Sustituido por `mockIntegrations.ts`, sin llamadas de red                        | Cliente / RRHH         | **Conceptual** | Crítica               |
| CI-EXT-HR-001      | API del sistema de RRHH                | Sustituido por adaptador simulado                                                | Cliente / RRHH         | **Conceptual** | Crítica               |
| CI-EXT-AUTH-001    | Autenticación corporativa              | No existe. La aplicación no autentica: el colaborador es un perfil ficticio fijo | Cliente / TI           | **Conceptual** | Crítica               |
| CI-EXT-DOC-001     | Gestor documental corporativo          | Sustituido por adaptador simulado                                                | Cliente / TI           | **Conceptual** | Alta                  |
| CI-EXT-DB-001      | Base de datos corporativa              | No existe. La persistencia es `localStorage` del navegador                       | Cliente / TI           | **Conceptual** | Crítica               |
| CI-EXT-CLOUD-001   | Infraestructura cloud                  | No existe. El despliegue usa GitHub Pages                                        | Cliente / TI           | **Conceptual** | Alta                  |
| CI-EXT-ANDROID-001 | Aplicación nativa Android              | No existe. Sustituida por una PWA                                                | Consultora             | **Conceptual** | Alta                  |
| CI-EXT-IOS-001     | Aplicación nativa iOS                  | No existe. Sustituida por una PWA                                                | Consultora             | **Conceptual** | Alta                  |
| CI-EXT-STORE-001   | Publicación en tiendas de aplicaciones | No existe. No hay firma, ni cuentas de desarrollador, ni distribución            | Consultora             | **Conceptual** | Media                 |
| CI-EXT-PUSH-001    | Servicio de notificaciones push        | No implementado. Registrado como backlog futuro                                  | Consultora             | **Conceptual** | Media                 |
| CI-EXT-BONUS-001   | Bonos con comercios aliados            | No implementado. Registrado como backlog futuro                                  | Cliente / RRHH         | **Conceptual** | Baja                  |

## Resumen cuantitativo

| Categoría                | CI implementados | CI pendientes | CI conceptuales |
| ------------------------ | ---------------- | ------------- | --------------- |
| Aplicación               | 11               | 0             | —               |
| Configuración técnica    | 12               | 0             | —               |
| Pruebas                  | 5                | 0             | —               |
| Automatización CI/CD     | 9                | 2             | —               |
| Documentación y gobierno | 19               | 3             | —               |
| Artefactos de entrega    | 0                | 6             | —               |
| Sistemas externos        | —                | —             | 11              |
| **Total**                | **56**           | **11**        | **11**          |

Los CI marcados como pendientes corresponden a fases posteriores del plan: los workflows de
despliegue y de release en la fase de automatización de despliegue, el informe de la Actividad 3 y
el registro de evidencias en la fase final, y los artefactos de entrega en las fases de release. Su
estado se actualiza en el momento en que el artefacto existe, no antes.

## Relación con la deuda técnica

| CI                   | Deudas asociadas                                       |
| -------------------- | ------------------------------------------------------ |
| CI-APP-SVC-001       | TD-001, TD-002, TD-003, TD-004, TD-005, TD-007, TD-008 |
| CI-APP-SVC-002       | TD-008                                                 |
| CI-APP-STORE-001     | TD-002                                                 |
| CI-APP-PAGE-001      | TD-003, TD-006, TD-009                                 |
| CI-CFG-DEP-001       | TD-007                                                 |
| CI-TST-COMP-001      | TD-006                                                 |
| Estructura de `src/` | TD-009                                                 |

Siete de las nueve deudas se concentran en un único CI. Eso no es casualidad: es la propiedad que
convierte la intervención de la Actividad 4 en un cambio acotado y su efecto en algo medible.
