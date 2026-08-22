# ADR-0003 — GitHub Actions, Pages y GHCR como plataforma de automatización

| Campo     | Valor                               |
| --------- | ----------------------------------- |
| Estado    | Aceptada                            |
| Fecha     | 21 de agosto de 2026                |
| Decisores | Responsable DevOps, Responsable SCM |
| Baseline  | `BL-DES-001`                        |

## Contexto

La Actividad 3 exige un pipeline CI/CD funcional con build, test y deploy, y evidencias reales de
su ejecución. Tres restricciones acotan la elección:

1. El pipeline debe ser **reproducible por cualquier integrante** sin infraestructura propia.
2. No puede depender de **secretos externos** ni de servicios de pago.
3. Las evidencias deben ser **verificables públicamente**, no capturas de una máquina local.

El repositorio de referencia analizado (`llipiterdev/nest-devops-lab`) incorpora Jenkins,
Minikube, runners self-hosted, SonarQube local y Snyk con secretos externos. Ese diseño es
legítimo en su contexto, pero incumple las tres restricciones anteriores: el pipeline solo se
ejecuta si existe una máquina concreta encendida y configurada.

## Alternativas consideradas

**Jenkins con runners self-hosted**, como en el repositorio de referencia. Descartada: el pipeline
depende de una máquina específica, y una evidencia que solo puede reproducirse en el equipo de una
persona no es una evidencia verificable.

**SonarQube autoalojado** para análisis de calidad. Descartada por la misma razón, más el costo de
mantener el servicio. Se sustituye por herramientas que se ejecutan dentro del propio pipeline:
ESLint para complejidad, jscpd para duplicación, cobertura de Vitest y `npm audit`. Miden lo mismo
sin infraestructura.

**Snyk con token externo.** Descartada. Introduce un secreto que no puede compartirse y un
servicio externo del que depende el resultado del pipeline. `npm audit` con umbral `high` cubre la
necesidad sin secretos y viene con el gestor de paquetes.

**Kubernetes o Minikube para el despliegue.** Descartada por desproporción absoluta: la aplicación
es un conjunto de archivos estáticos. Desplegarla en un clúster no demostraría nada sobre control
de versiones y añadiría una dependencia de infraestructura considerable.

## Decisión

| Función                     | Herramienta                          | Justificación                                                  |
| --------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| Integración continua        | GitHub Actions                       | Integrada con el repositorio; ejecución pública y verificable  |
| Despliegue de la aplicación | GitHub Pages                         | Sirve archivos estáticos sin infraestructura, con URL pública  |
| Registro de contenedores    | GHCR                                 | Autenticación con `GITHUB_TOKEN`, sin secretos adicionales     |
| Empaquetado                 | Docker multi-stage                   | Imagen mínima; el build ocurre en la etapa que se descarta     |
| Análisis de complejidad     | ESLint con configuración de medición | Ya presente en el proyecto; no requiere servicio externo       |
| Análisis de duplicación     | jscpd                                | Se ejecuta como dependencia de desarrollo                      |
| Cobertura                   | Vitest con proveedor v8              | Integrada con el ejecutor de pruebas                           |
| Vulnerabilidades            | `npm audit --audit-level=high`       | Incluida en npm; sin token ni servicio externo                 |
| Pruebas end-to-end          | Playwright                           | Navegadores gestionados por la propia herramienta en el runner |

**Ningún elemento del pipeline requiere un secreto externo.** El único token utilizado es el
`GITHUB_TOKEN` que la plataforma provee automáticamente a cada ejecución, con permisos mínimos
declarados por job.

## Consecuencias

**Favorables.** Cualquier integrante puede reproducir el pipeline completo haciendo fork del
repositorio, sin configurar nada. Los registros de ejecución son públicos y permanentes, lo que
convierte la evidencia en verificable por terceros. No hay costo ni infraestructura que mantener.

**Desfavorables.** Existe dependencia de un único proveedor: migrar a otra plataforma exigiría
reescribir los workflows. GitHub Pages solo sirve contenido estático, lo que descarta cualquier
componente de servidor.

**Aceptadas.** La dependencia del proveedor es asumible en el alcance académico, y la limitación a
contenido estático es coherente con la decisión de alcance de `ADR-0001`.

## Elementos del repositorio de referencia que sí se reutilizan

El análisis del repositorio de referencia no se descarta en bloque. Los patrones adoptados:

| Patrón reutilizado                                       | Aplicación en este proyecto                           |
| -------------------------------------------------------- | ----------------------------------------------------- |
| Estructura de job con checkout, setup de Node y `npm ci` | Base de todos los jobs del pipeline                   |
| Instalación reproducible con `npm ci` sobre el lockfile  | Garantiza builds idénticos entre ejecuciones          |
| Secuencia de verificación lint, test y build             | Conservada y ampliada con tipos, cobertura y métricas |
| Build de Docker multi-stage con imagen Alpine            | Adoptado para la imagen de producción                 |
| Caché de dependencias de npm                             | Adoptado mediante la caché nativa de `setup-node`     |

La diferencia no está en los patrones sino en dónde se ejecutan: todos los jobs usan runners
alojados por GitHub, no self-hosted.
