# ADR-0002 — GitFlow liviano como estrategia de ramas

| Campo     | Valor                                         |
| --------- | --------------------------------------------- |
| Estado    | Aceptada                                      |
| Fecha     | 21 de agosto de 2026                          |
| Decisores | Responsable SCM, Líder de consultoría, DevOps |
| Baseline  | `BL-DES-001`                                  |

## Contexto

El equipo se modela como una consultora que desarrolla y mantiene software para un cliente. Esa
forma de operar implica dos realidades concurrentes: la versión que el cliente tiene aprobada e
instalada, y el trabajo de la siguiente entrega. Ambas pueden requerir atención simultánea.

La Actividad 3 exige además baselines identificables, control de cambios auditable y trazabilidad
completa desde el requisito hasta el despliegue.

## Alternativas consideradas

### Trunk-based development

Una sola rama de integración, ramas de vida muy corta, despliegue continuo.

Ventajas reales: menos conflictos de integración, ciclo más rápido, menos operaciones de merge, y
es la práctica asociada a los equipos de mayor rendimiento en despliegue continuo.

Se descarta porque **no produce las evidencias que la actividad requiere**. Sin ramas de release
no hay un punto explícito de estabilización y aprobación de una baseline. Sin separación entre
`main` y la integración, la respuesta a un incidente productivo arrastraría trabajo no liberado.
La ausencia de esa separación es una virtud cuando se despliega diez veces al día, y un problema
cuando se entregan versiones formales a un cliente.

### GitHub Flow

Una rama principal más ramas de funcionalidad, sin ramas de release.

Se descarta por una razón puntual pero decisiva: no ofrece un lugar donde estabilizar una entrega
sin bloquear el desarrollo. En el modelo de consultora, el periodo entre "el código está listo" y
"el cliente aprueba la entrega" es real y necesita una rama propia.

### GitFlow completo

Incluye ramas `support/*` para mantener múltiples versiones mayores en paralelo.

Se descarta por desproporción. El proyecto mantiene una sola línea de versiones; las ramas de
soporte añadirían ceremonia sin ningún caso de uso que la justifique.

## Decisión

Se adopta **GitFlow liviano**: `main` y `develop` como ramas permanentes, y `feature/*`, `fix/*`,
`release/*` y `hotfix/*` como ramas temporales. Sin ramas `support/*`.

Reglas de integración:

- Merge commits obligatorios; squash y rebase deshabilitados a nivel de repositorio.
- Pull request obligatorio hacia ambas ramas permanentes, con checks de CI en verde.
- Prohibición de force-push y de eliminación de ramas permanentes.
- Un único prefijo por propósito: `feature/`, nunca `feat/`.

## Justificación de merge commits

Squash merge produce un historial más limpio y es la opción por defecto de muchos equipos. Se
descarta deliberadamente porque destruye precisamente la información que la actividad debe
evidenciar: los commits individuales con su tipo convencional y su alcance.

La fase de módulos legacy produjo cinco commits convencionales trazables. Un squash los convertiría
en uno solo, y con ellos desaparecería la evidencia de la convención. El merge commit conserva
ambas cosas: el detalle de cada commit y un punto de integración identificable.

## Consecuencias

**Favorables.** `main` contiene exclusivamente versiones liberadas, lo que hace que cada baseline
productiva sea inequívoca. Las ramas de release permiten estabilizar sin bloquear el desarrollo.
Cada integración es un pull request con su evaluación de impacto, lo que produce trazabilidad
completa sin esfuerzo adicional. La respuesta a un incidente productivo parte exactamente de lo
entregado.

**Desfavorables.** Más ramas y más operaciones que trunk-based development. Cada entrega exige una
doble integración: hacia `main` y de vuelta hacia `develop`. Un cambio trivial recorre el mismo
camino que una funcionalidad completa. Las ramas de larga vida aumentan la probabilidad de
conflictos.

**Aceptadas.** El costo adicional es exactamente lo que genera la evidencia requerida. En un
contexto distinto —despliegue continuo, sin entregas formales— la misma decisión sería un error.
**GitFlow no es universalmente superior**: es adecuado para este contexto y estos objetivos.

## Corrección respecto al repositorio de referencia

El repositorio `llipiterdev/nest-devops-lab`, analizado como referencia, presenta debilidades que
esta decisión corrige explícitamente:

| Debilidad observada                               | Corrección adoptada                                       |
| ------------------------------------------------- | --------------------------------------------------------- |
| Coexistencia de los prefijos `feat/` y `feature/` | Un único prefijo `feature/`, sin sinónimos                |
| Ausencia de tags SemVer                           | Tags anotados obligatorios para cada versión              |
| Ausencia de releases versionadas                  | GitHub Release por cada tag, con notas del `CHANGELOG.md` |
| Trazabilidad SCM incompleta                       | Matriz de trazabilidad de requisito a despliegue          |
