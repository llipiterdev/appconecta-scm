# Índice de evidencias — Actividad 3

Todo lo que se enumera aquí existe y puede consultarse. Los datos de ejecución provienen de
`npm run evidence` sobre el commit `762144a`, con fecha 22 de agosto de 2026.

## 1. Repositorio

| Evidencia               | Enlace o valor                                               |
| ----------------------- | ------------------------------------------------------------ |
| Repositorio             | <https://github.com/llipiterdev/appconecta-scm>              |
| Visibilidad             | Pública                                                      |
| Grafo de commits        | <https://github.com/llipiterdev/appconecta-scm/network>      |
| Commits en el historial | 63                                                           |
| Rama `main`             | <https://github.com/llipiterdev/appconecta-scm/tree/main>    |
| Rama `develop`          | <https://github.com/llipiterdev/appconecta-scm/tree/develop> |

Las once ramas de trabajo se conservan sin eliminar, para que la evidencia del recorrido siga
siendo consultable: `feature/scm-bootstrap`, `feature/app-shell`, `feature/legacy-modules`,
`feature/scm-governance`, `feature/ci-pipeline`, `feature/virtual-card`, `feature/cd-automation`,
`release/0.1.0`, `release/0.2.0`, `hotfix/release-workflow-metrics` y las de mantenimiento
`chore/*`.

## 2. Issues y RFC

| Issue                                                        | Título                                | Estado      |
| ------------------------------------------------------------ | ------------------------------------- | ----------- |
| [#1](https://github.com/llipiterdev/appconecta-scm/issues/1) | Scaffold y herramientas de calidad    | Cerrada     |
| [#2](https://github.com/llipiterdev/appconecta-scm/issues/2) | Módulos legacy simulados              | Cerrada     |
| [#3](https://github.com/llipiterdev/appconecta-scm/issues/3) | Gobierno SCM                          | Cerrada     |
| [#4](https://github.com/llipiterdev/appconecta-scm/issues/4) | Pipeline CI                           | Cerrada     |
| [#5](https://github.com/llipiterdev/appconecta-scm/issues/5) | Carné virtual QR (RFC-001)            | Cerrada     |
| [#6](https://github.com/llipiterdev/appconecta-scm/issues/6) | Pipeline CD                           | Cerrada     |
| [#7](https://github.com/llipiterdev/appconecta-scm/issues/7) | Preparación de v0.1.0                 | Cerrada     |
| [#8](https://github.com/llipiterdev/appconecta-scm/issues/8) | Preparación de v0.2.0                 | Cerrada     |
| [#9](https://github.com/llipiterdev/appconecta-scm/issues/9) | TD-001, reservada para la Actividad 4 | **Abierta** |

La `#9` permanece abierta a propósito: es la intervención de mantenimiento de la Actividad 4 y
cerrarla ahora afirmaría que la deuda está resuelta.

**RFC-001**, la solicitud formal de cambio del carné virtual, está en
[`docs/rfc/RFC-001-virtual-card.md`](../rfc/RFC-001-virtual-card.md) con sus diez criterios de
aceptación verificados y sus ocho casos de prueba localizados.

Las ocho etiquetas del proyecto son `feature`, `fix`, `technical-debt`, `rfc`,
`configuration-change`, `release`, `documentation` y `ci-cd`.

## 3. Pull requests

Once integraciones, todas con checks en verde y merge commit.

| PR                                                           | Contenido                                  | Destino   | Checks |
| ------------------------------------------------------------ | ------------------------------------------ | --------- | ------ |
| [#10](https://github.com/llipiterdev/appconecta-scm/pull/10) | Scaffold y validación de pull request      | `develop` | 4      |
| [#11](https://github.com/llipiterdev/appconecta-scm/pull/11) | Shell responsive de la aplicación          | `develop` | 4      |
| [#12](https://github.com/llipiterdev/appconecta-scm/pull/12) | Módulos del portal y deuda intencional     | `develop` | 4      |
| [#13](https://github.com/llipiterdev/appconecta-scm/pull/13) | Gobierno SCM y baseline de diseño          | `develop` | 4      |
| [#14](https://github.com/llipiterdev/appconecta-scm/pull/14) | Pipeline completo y control de deuda       | `develop` | 7      |
| [#15](https://github.com/llipiterdev/appconecta-scm/pull/15) | Entrega v0.1.0                             | `main`    | 7      |
| [#22](https://github.com/llipiterdev/appconecta-scm/pull/22) | Reintegración de v0.1.0                    | `develop` | 7      |
| [#23](https://github.com/llipiterdev/appconecta-scm/pull/23) | Cierre de registros de v0.1.0              | `develop` | 7      |
| [#24](https://github.com/llipiterdev/appconecta-scm/pull/24) | Carné virtual con QR                       | `develop` | 7      |
| [#25](https://github.com/llipiterdev/appconecta-scm/pull/25) | Automatización del despliegue              | `develop` | 7      |
| [#26](https://github.com/llipiterdev/appconecta-scm/pull/26) | Entrega v0.2.0                             | `main`    | 7      |
| [#27](https://github.com/llipiterdev/appconecta-scm/pull/27) | Hotfix del workflow de publicación         | `main`    | 7      |
| [#28](https://github.com/llipiterdev/appconecta-scm/pull/28) | Back-merge y cierre de registros de v0.2.0 | `develop` | 7      |

El número de checks pasa de cuatro a siete al integrarse el pipeline completo en el PR #14. El
cambio es real y está explicado en la matriz de trazabilidad.

## 4. Protección de ramas

| Ruleset                 | Aplica a            | Enlace                                                                   |
| ----------------------- | ------------------- | ------------------------------------------------------------------------ |
| Protección de `main`    | Versiones liberadas | [Rulesets](https://github.com/llipiterdev/appconecta-scm/settings/rules) |
| Protección de `develop` | Integración         | [Rulesets](https://github.com/llipiterdev/appconecta-scm/settings/rules) |

Ambos exigen pull request, los siete checks de CI, conversaciones resueltas, y prohíben force-push
y la eliminación de la rama. **Cero aprobaciones humanas obligatorias**, porque el proyecto opera
con una sola identidad y exigir un revisor que no existe sería un control ficticio.

## 5. Tags y releases

| Tag           | Tipo    | Baseline      | Release                                                                     |
| ------------- | ------- | ------------- | --------------------------------------------------------------------------- |
| `v0.1.0-rc.1` | Anotado | `BL-DEV-001`  | —                                                                           |
| `v0.1.0`      | Anotado | `BL-PROD-001` | [v0.1.0](https://github.com/llipiterdev/appconecta-scm/releases/tag/v0.1.0) |
| `v0.2.0-rc.1` | Anotado | `BL-DEV-002`  | —                                                                           |
| `v0.2.0`      | Anotado | `BL-PROD-002` | [v0.2.0](https://github.com/llipiterdev/appconecta-scm/releases/tag/v0.2.0) |

Los cuatro tags llevan las métricas medidas en el propio mensaje del tag, de modo que el estado del
proyecto en ese punto es consultable sin salir de Git.

## 6. Artefactos de la entrega v0.2.0

| Artefacto            | Identificación                                                                       |
| -------------------- | ------------------------------------------------------------------------------------ |
| Merge commit         | `0595748` en `main`                                                                  |
| Paquete del build    | `appconecta-v0.2.0-dist.tar.gz`, 612 637 bytes                                       |
| Suma de verificación | `appconecta-v0.2.0-dist.tar.gz.sha256`                                               |
| Imagen               | `ghcr.io/llipiterdev/appconecta-scm:0.2.0`, también `0.2`, `latest` y `sha-0595748…` |
| Digest de la imagen  | `sha256:c7dd553c6476ce48f7c09d97bd1ed3399373e2202912a6f7fe6d08b7fa449615`            |
| Despliegue           | <https://llipiterdev.github.io/appconecta-scm/>                                      |

## 7. Pipelines

| Workflow                   | Enlace                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| Integración continua       | [ci.yml](https://github.com/llipiterdev/appconecta-scm/actions/workflows/ci.yml)           |
| Despliegue en GitHub Pages | [deploy.yml](https://github.com/llipiterdev/appconecta-scm/actions/workflows/deploy.yml)   |
| Publicación de versión     | [release.yml](https://github.com/llipiterdev/appconecta-scm/actions/workflows/release.yml) |

### Ejecuciones fallidas que se conservan

No se han borrado y no deben borrarse. Son la evidencia de que los controles detectan defectos.

| Ejecución                                                                             | Qué detectó                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [32554607620](https://github.com/llipiterdev/appconecta-scm/actions/runs/32554607620) | El control de no regresión se ejecutaba sin haber generado antes las mediciones |
| Publicación disparada por `v0.2.0-rc.1`                                               | El disparador no distinguía un candidato de una versión liberada                |

## 8. Validaciones ejecutadas

Trece validaciones, todas con resultado de éxito sobre el commit `762144a`.

| Validación                         | Comando                       | Resultado                               |
| ---------------------------------- | ----------------------------- | --------------------------------------- |
| Instalación reproducible           | `npm ci`                      | Éxito                                   |
| Formato                            | `npm run format:check`        | Éxito                                   |
| Análisis estático                  | `npm run lint`                | Éxito                                   |
| Verificación de tipos              | `npm run typecheck`           | Éxito                                   |
| Pruebas unitarias y de componentes | `npm run test`                | Éxito, 72 pruebas                       |
| Cobertura                          | `npm run test:coverage`       | Éxito                                   |
| Build de producción                | `npm run build`               | Éxito                                   |
| Complejidad ciclomática            | `npm run metrics:complexity`  | Éxito                                   |
| Duplicación                        | `npm run metrics:duplication` | Éxito                                   |
| Vulnerabilidades                   | `npm run metrics:audit`       | Éxito, cero hallazgos                   |
| Control de no regresión            | `npm run metrics:gate`        | Éxito, 9 indicadores dentro de baseline |
| Pruebas de extremo a extremo       | `npm run test:e2e`            | Éxito, 22 pruebas                       |
| Construcción de imagen             | `docker build`                | Éxito                                   |

## 9. Métricas medidas

| Indicador                            | Valor   |
| ------------------------------------ | ------- |
| Cobertura de sentencias              | 90,02 % |
| Cobertura de ramas                   | 75,43 % |
| Cobertura de funciones               | 93,22 % |
| Cobertura de líneas                  | 89,94 % |
| Complejidad ciclomática máxima       | 26      |
| Líneas del archivo mayor             | 580     |
| Funciones medidas                    | 113     |
| Duplicación                          | 0,71 %  |
| Clones detectados                    | 2       |
| Líneas duplicadas                    | 20      |
| Vulnerabilidades `high` o `critical` | 0       |

## 10. Capturas

**Estado: pendientes.** La captura automatizada no se completó en esta sesión y la carpeta
`capturas/` no existe todavía. Se registran aquí las URLs exactas para que puedan tomarse de forma
manual sobre el despliegue real, que es lo que se documentaría en cualquier caso.

| Pantalla                        | URL                                                 |
| ------------------------------- | --------------------------------------------------- |
| Dashboard del colaborador       | <https://llipiterdev.github.io/appconecta-scm/>     |
| Carné virtual con código QR     | Navegación → «Carné»                                |
| Documentos laborales            | Navegación → «Documentos»                           |
| Desprendibles de nómina         | Navegación → «Nómina»                               |
| Solicitudes de Recursos Humanos | Navegación → «Solicitudes»                          |
| Vista móvil                     | Cualquiera de las anteriores con viewport de 390 px |

Las secciones se alcanzan por la navegación de la propia interfaz y no escribiendo la ruta: un
enlace directo devuelve estado 404 y el documento de redirección, que el navegador resuelve del
lado del cliente. Ese comportamiento es el diseñado y está explicado en
[`docs/ci-cd.md`](../ci-cd.md).

Anunciar aquí seis archivos que no existen sería exactamente el tipo de evidencia fabricada que
este trabajo evita. La sección se completa cuando los archivos estén, no antes.

## 11. Documentación de gobierno

| Documento                                                                           | Contenido                              |
| ----------------------------------------------------------------------------------- | -------------------------------------- |
| [`configuration-items.md`](../configuration-items.md)                               | 66 Configuration Items con propietario |
| [`baselines.md`](../baselines.md)                                                   | Seis baselines establecidas            |
| [`change-control.md`](../change-control.md)                                         | Proceso de control de cambios          |
| [`traceability-matrix.md`](../traceability-matrix.md)                               | Requisito → despliegue                 |
| [`technical-debt-register.md`](../technical-debt-register.md)                       | Nueve deudas con métrica               |
| [`maintenance-baseline.md`](../maintenance-baseline.md)                             | Baseline para la Actividad 4           |
| [`unidad-3/actividad-3-...md`](../unidad-3/actividad-3-control-versiones-devops.md) | Documento final                        |

## 12. Lo que no existe

Enumerarlo importa tanto como enumerar lo anterior.

| Elemento                                | Estado                                 |
| --------------------------------------- | -------------------------------------- |
| APIs de nómina y RRHH                   | Simuladas mediante adaptadores mock    |
| Autenticación corporativa               | Conceptual                             |
| Base de datos e infraestructura cloud   | Conceptuales                           |
| Aplicaciones Android e iOS              | Conceptuales                           |
| Notificaciones push y bonos con aliados | Backlog futuro, no implementados       |
| Aprobaciones humanas y revisores        | **No existen**, y no se simulan        |
| Incidentes de producción                | Ninguno inventado                      |
| Versión v1.0.0                          | No publicada, por decisión justificada |
