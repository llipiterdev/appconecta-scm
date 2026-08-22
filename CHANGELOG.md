# Changelog

Este archivo registra los cambios relevantes de AppConecta. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones se rigen por
[Versionamiento Semántico](https://semver.org/lang/es/).

Las versiones enlazan con su comparación en GitHub. Cada entrada corresponde a commits reales
integrados mediante pull request; no se registran cambios que no existan en el historial.

## [No publicado]

Sin cambios pendientes de publicación.

## [0.1.0] — 2026-08-22

Primera baseline funcional de la simulación de AppConecta. La versión entrega el portal del
colaborador operativo, el modelo de gestión de configuración documentado, el pipeline de
integración continua completo y la deuda técnica intencional medida.

Esta versión **no cierra la deuda técnica**: la registra y la deja medible. La intervención de
mantenimiento sobre `legacyEmployeeService` está reservada para la Actividad 4, que necesita una
baseline estable contra la cual comparar.

### Añadido

**Portal del colaborador**

- Shell responsive con navegación diferenciada para móvil y escritorio, y aviso permanente de que
  el sistema es una simulación académica (`11dec1c`, `de5aef6`).
- Primitivas de interfaz accesibles y estados compartidos de carga, vacío y error (`0d3b239`,
  `c1be172`).
- Dashboard, perfil, anuncios corporativos, documentos laborales, desprendibles de nómina,
  solicitudes de Recursos Humanos, registro de incapacidades y consulta del estado de las
  solicitudes (`53e2301`).
- Contratos simulados de los sistemas corporativos de nómina y Recursos Humanos (`8248fec`).
- Manifiesto de aplicación web y service worker para instalación como PWA (`8fc3b90`).

**Gestión de configuración**

- Inventario de Configuration Items, distinguiendo los implementados de los conceptuales
  (`7399e59`).
- Baselines funcional, de diseño, de desarrollo y productiva, con su método de identificación
  (`7399e59`).
- Proceso de control de cambios, estrategia de ramas, política de versionamiento y convención de
  commits (`4cc5739`, `fa9bfa4`).
- Matriz RACI y trazabilidad de requisito a despliegue (`e0fdccf`).
- Decisiones de arquitectura ADR-0001 a ADR-0003 y solicitud formal de cambio RFC-001 para el
  carné virtual (`d5201b3`, `8dcade5`).
- Relación explícita entre los hallazgos de las Actividades 1 y 2 y esta implementación
  (`d1f2fee`).

**Automatización**

- Validación de mensajes de commit, formato, análisis estático y verificación de tipos en cada
  pull request (`33511c8`, `eb93ce1`).
- Pruebas unitarias, de componente y de extremo a extremo con Playwright sobre el build de
  producción (`a4d6a28`, `2af5b91`).
- Medición reproducible de complejidad ciclomática, duplicación y vulnerabilidades, con un control
  que impide que las métricas empeoren en silencio (`9f7b0f0`, `831d286`).
- Imagen de contenedor multietapa servida por nginx sin privilegios de root (`83f9ba9`,
  `b9a9aa9`).
- Script reproducible de recopilación de evidencias (`9f7b0f0`).

### Deuda técnica registrada

Nueve deudas intencionales, documentadas en
[`docs/technical-debt-register.md`](docs/technical-debt-register.md) con su evidencia y su
métrica (`ebb41c9`). Las principales quedan pendientes por diseño:

| Deuda  | Descripción                                                        | Métrica medida               |
| ------ | ------------------------------------------------------------------ | ---------------------------- |
| TD-001 | Servicio legacy que concentra persistencia, validación y reglas    | 580 líneas en un solo módulo |
| TD-002 | Acoplamiento directo entre reglas de negocio y `localStorage`      | 8 accesos directos           |
| TD-003 | Validaciones duplicadas entre solicitudes e incapacidades          | 0,77 % de duplicación        |
| TD-005 | Complejidad ciclomática elevada en `processSubmission`             | Complejidad 26               |
| TD-007 | Dependencia en modo mantenimiento (`moment`), sin vulnerabilidades | 11 usos                      |
| TD-009 | Separación de responsabilidades insuficiente, sin capa de dominio  | Documentada                  |

### Métricas de la baseline

Medidas sobre esta versión y versionadas en `metrics-baseline.json`:

| Métrica                        | Valor   |
| ------------------------------ | ------- |
| Cobertura de sentencias        | 89,19 % |
| Cobertura de ramas             | 75,00 % |
| Complejidad ciclomática máxima | 26      |
| Duplicación                    | 0,77 %  |
| Vulnerabilidades high/critical | 0       |

### Notas

- El commit inicial `114e7b2` es anterior a la adopción de Conventional Commits y se conserva sin
  reescribir, registrado como excepción histórica en
  [`docs/conventional-commits.md`](docs/conventional-commits.md).
- Todas las integraciones con sistemas corporativos son simuladas. No existe backend, base de
  datos, autenticación real ni datos personales reales.

[no publicado]: https://github.com/llipiterdev/appconecta-scm/compare/v0.1.0...develop
[0.1.0]: https://github.com/llipiterdev/appconecta-scm/releases/tag/v0.1.0
