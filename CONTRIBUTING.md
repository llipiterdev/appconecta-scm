# Guía de contribución

Este repositorio implementa la estrategia de gestión de configuración de la Actividad 3.
Las reglas de esta guía no son formalidades: son los controles que hacen auditable la
evolución del sistema.

## Requisitos del entorno

- **Node.js 24 LTS (Krypton)**. La versión exacta está fijada en `.nvmrc`.
  Con `nvm` (Windows o Unix): `nvm install 24 && nvm use 24`.
- **npm** (incluido con Node 24). El `package-lock.json` es un Configuration Item:
  no lo elimine ni lo regenere sin necesidad.

Instalación:

```bash
npm ci
```

> `npm ci` instala exactamente las versiones del lockfile. Use `npm install` solo cuando
> deliberadamente agregue o actualice una dependencia.

## Estrategia de ramas (GitFlow liviano)

Ramas permanentes:

- `main` — versiones formalmente liberadas al cliente. Referencia de auditoría.
- `develop` — integración de la siguiente entrega.

Ramas temporales:

- `feature/*` — nuevas funcionalidades y solicitudes.
- `fix/*` — correcciones ordinarias.
- `release/*` — estabilización y aprobación de una baseline.
- `hotfix/*` — respuesta a incidentes productivos.

Reglas de obligado cumplimiento:

- No se desarrolla directamente en `main`.
- No se desarrollan funcionalidades directamente en `develop`.
- Todo cambio nace de una issue o de un RFC.
- Todo cambio se implementa en una rama.
- Toda integración pasa por pull request.
- Se integra con **merge commits**. Squash y rebase están deshabilitados en el repositorio.
- No se usa `--force`, `--force-with-lease` ni `commit --amend` sobre historia publicada.
- Las ramas no se eliminan antes de recopilar las evidencias de la actividad.

El detalle y la justificación del trade-off frente a trunk-based development están en
`docs/git-workflow.md` y `docs/adr/0002-gitflow-strategy.md`.

## Conventional Commits

Formato:

```
<tipo>(<alcance>): <descripción en minúsculas y en inglés>

[cuerpo opcional en español]

[pie opcional: Refs #12]
```

Tipos permitidos: `feat`, `fix`, `docs`, `test`, `refactor`, `ci`, `build`, `chore`,
`perf`, `style`.

Ejemplos:

```
feat(payroll): add mock payslip consultation
docs(debt): register intentional technical debt
ci(quality): add pull request validation
chore(release): prepare version 0.1.0
```

Las reglas se validan automáticamente en dos puntos:

- **Localmente**, por el hook `commit-msg` de husky.
- **En CI**, por el job `commits`, que valida todos los mensajes del pull request.

Cada commit debe ser lógico y verificable. No se aceptan commits gigantes que agrupen
cambios sin relación. Referencie la issue en el cuerpo cuando aporte trazabilidad.

## Versionamiento semántico

- `fix` compatible → **PATCH**
- `feat` compatible → **MINOR**
- `BREAKING CHANGE` → **MAJOR**
- Cambios exclusivamente documentales o de CI no obligan por sí mismos a mover la versión
  funcional; se agrupan en la siguiente release.

Los tags son **anotados** y deben coincidir exactamente con la versión de `package.json`.
Ver `docs/versioning.md`.

## Verificación antes de abrir un pull request

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

El pull request no se fusiona hasta que los checks de CI estén en verde. **No se reducen
los controles para conseguir un pipeline verde**: si algo falla, se corrige en la rama.

## Deuda técnica

La deuda técnica deliberada es legítima; la deuda que nadie registra ni cuantifica no lo es.

- Toda deuda nueva debe registrarse en `docs/technical-debt-register.md` con un identificador
  `TD-xxx` y una métrica medida.
- **No refactorice `src/services/legacyEmployeeService.ts`.** Las deudas TD-001 y TD-005
  están reservadas como objeto de la intervención de mantenimiento de la Actividad 4 y su
  baseline debe permanecer intacta.
- No se introducen vulnerabilidades, secretos ni pruebas deshabilitadas para "simular" deuda.

## Honestidad de la evidencia

Este es un proyecto académico y su valor depende de que las evidencias sean reales:

- No se fabrican métricas, capturas, logs ni resultados.
- No se presentan Configuration Items conceptuales como implementados.
- No se afirman incidentes, vulnerabilidades ni historia que no hayan ocurrido.
- Los campos que dependen de información futura se dejan como `pendiente` hasta que exista
  el dato real (hash, número de pull request, URL).
- Se distingue siempre entre supuesto académico, riesgo previsto y evidencia medida.
