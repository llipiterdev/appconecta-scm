# AGENTS.md

Instrucciones para agentes de código que trabajen en este repositorio.

## Qué es este proyecto

Simulación académica de **AppConecta**, un portal del colaborador, construida para evidenciar
una estrategia de control de versiones, gestión de configuración y automatización DevOps
(asignatura Gestión de Configuración y Mantenimiento de Software).

No es un producto real. Los diez años de operación descritos en los diagnósticos previos son
un **supuesto académico**, no historia real de este repositorio.

## Restricciones que no se pueden violar

1. **No refactorizar `src/services/legacyEmployeeService.ts`.** Sus deudas TD-001 y TD-005
   son el objeto de la intervención de mantenimiento de la Actividad 4 y su baseline debe
   permanecer medible e intacta. Lo mismo aplica a las deudas TD-002, TD-003, TD-004, TD-008
   y TD-009 mientras no exista una issue que autorice su cierre.
2. **No fabricar evidencia.** Métricas, capturas, logs, hashes, URLs y resultados deben
   provenir de ejecuciones reales. Si un dato no existe todavía, se escribe `pendiente`.
3. **No presentar Configuration Items conceptuales como implementados.** Las APIs de nómina
   y RRHH, la autenticación corporativa, la base de datos, la infraestructura cloud y las
   apps nativas son simulaciones o conceptos, nunca implementaciones.
4. **No introducir secretos ni datos personales reales.** Todos los datos son ficticios.
5. **No reducir controles para conseguir CI verde.** Si un check falla, se corrige el código.
6. **No reescribir historia publicada.** Sin `push --force`, sin `rebase` destructivo, sin
   `commit --amend` después de publicar. Integración por merge commits.
7. **No inventar aprobaciones humanas, revisores ni participación de personas.**

## Convenciones

- **Idioma**: la interfaz y la documentación están en español; el código y los
  identificadores, en inglés. Los mensajes de commit van en inglés.
- **Commits**: Conventional Commits, validados por husky y por CI. Tipos permitidos:
  `feat`, `fix`, `docs`, `test`, `refactor`, `ci`, `build`, `chore`, `perf`, `style`.
- **Ramas**: GitFlow liviano. `feature/*`, `fix/*`, `release/*`, `hotfix/*` sobre `develop`;
  solo `release/*` y `hotfix/*` llegan a `main`.
- **Alias de importación**: `@/` apunta a `src/`.
- **Estilo**: Prettier y ESLint deciden. No discuta el formato, ejecute `npm run format`.

## Comandos

```bash
npm ci                  # instalación reproducible
npm run dev             # servidor de desarrollo
npm run format:check    # verificación de formato
npm run lint            # análisis estático
npm run typecheck       # verificación de tipos
npm run test            # pruebas unitarias y de componentes
npm run test:coverage   # cobertura
npm run build           # build de producción
```

Antes de abrir un pull request deben pasar los cinco primeros.

## Dónde está la información

- `docs/configuration-items.md` — inventario de CI.
- `docs/baselines.md` — baselines y su identificación.
- `docs/change-control.md` — proceso de control de cambios y niveles de severidad.
- `docs/technical-debt-register.md` — registro de deuda con sus métricas.
- `docs/maintenance-baseline.md` — matriz antes/después reservada a la Actividad 4.
- `docs/traceability-matrix.md` — trazabilidad requisito → despliegue.
- `docs/ci-cd.md` — diseño de los pipelines.
- `docs/adr/` — decisiones de arquitectura.
- `docs/rfc/` — solicitudes formales de cambio.

## Nota sobre la complejidad ciclomática

La regla `complexity` de ESLint está deliberadamente desactivada en `eslint.config.js`. La
complejidad **no se trata como error de lint**: es una métrica de deuda técnica que se mide
de forma independiente y se compara contra una baseline versionada. No la active para
"arreglar" la deuda.
