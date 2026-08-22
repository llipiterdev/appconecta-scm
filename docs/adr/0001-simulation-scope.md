# ADR-0001 — Alcance simulado del sistema AppConecta

| Campo     | Valor                                               |
| --------- | --------------------------------------------------- |
| Estado    | Aceptada                                            |
| Fecha     | 21 de agosto de 2026                                |
| Decisores | Arquitectura, Líder de consultoría, Responsable SCM |
| Baseline  | `BL-DES-001`                                        |

## Contexto

AppConecta se describe en las Actividades 1 y 2 como una aplicación móvil corporativa con
aproximadamente diez años de operación, integrada con sistemas de nómina, Recursos Humanos,
autenticación corporativa y gestión documental, y distribuida a través de tiendas de aplicaciones.

Ese sistema **no existe**. Es un caso de estudio construido para la asignatura. La Actividad 3
exige, sin embargo, evidencias reales: un repositorio real, un pipeline que se ejecuta de verdad,
métricas medidas y una baseline honesta para la intervención de mantenimiento de la Actividad 4.

La tensión es evidente. El diagnóstico describe un sistema que no puede construirse en el alcance
de la asignatura, y la evidencia exigida no admite invención. Hay que decidir qué se construye
realmente y cómo se declara la diferencia.

## Alternativas consideradas

**Construir un sistema completo con backend, base de datos e integraciones reales.** Descartada.
El esfuerzo se concentraría en infraestructura que no aporta ninguna evidencia adicional sobre
control de versiones o gestión de configuración, y el resultado dependería de servicios externos
que comprometerían la reproducibilidad del pipeline.

**Documentar el sistema sin construir nada.** Descartada. Sin código real no hay métricas reales,
y sin métricas reales la Actividad 4 no tendría baseline contra la cual demostrar una mejora. Sería
además incompatible con el entregable exigido.

**Simular datos presentándolos como reales.** Descartada por razones que no son de conveniencia.
Fabricar historial, incidentes o métricas invalidaría todo el trabajo y contradice el compromiso
de honestidad del proyecto.

## Decisión

Se construye una **Progressive Web App funcional** que representa académicamente el cliente móvil
de AppConecta, con estas condiciones:

1. La aplicación es real, funcional y verificable. El código, las pruebas, el pipeline y las
   métricas son auténticos.
2. Las integraciones con los cuatro sistemas corporativos son **adaptadores simulados en código**,
   sin llamadas de red. Exponen la forma cruda que tendrían los sistemas heredados.
3. La persistencia usa `localStorage`. No hay base de datos ni backend.
4. No hay autenticación. El colaborador es un perfil ficticio fijo.
5. Todos los datos son ficticios y así se declaran.
6. La naturaleza simulada se declara **en tres lugares independientes**: el `README.md`, un aviso
   permanente en la interfaz de la aplicación y el inventario de Configuration Items, donde los
   sistemas externos figuran explícitamente como conceptuales.

## Consecuencias

**Favorables.** El pipeline es reproducible por cualquier integrante sin infraestructura ni
secretos. Las métricas son reales y comparables entre versiones. La lectura del proyecto no puede
confundir lo construido con lo diagnosticado, porque la distinción está declarada en el propio
producto.

**Desfavorables.** El sistema no demuestra capacidades que requerirían backend real: autenticación,
concurrencia, integración con APIs. Los Configuration Items conceptuales no tienen artefacto
verificable, solo una entrada en el inventario que declara su ausencia.

**Aceptadas.** Ambas limitaciones son proporcionadas al objetivo. La Actividad 3 evalúa la
estrategia de control de versiones y automatización, no la completitud funcional del sistema.

## Relación con la deuda técnica

Esta decisión es la causa directa de tres deudas registradas, y ese vínculo es deliberado:

| Deuda  | Relación con esta decisión                                                         |
| ------ | ---------------------------------------------------------------------------------- |
| TD-002 | La ausencia de backend hace que la persistencia sea `localStorage`                 |
| TD-008 | Los adaptadores simulados exponen contratos crudos, consumidos sin capa intermedia |
| TD-009 | El alcance reducido justificó no construir una capa de dominio inicial             |

Reconocer que la deuda tiene origen en una decisión de alcance, y no en un descuido, es lo que la
hace defendible y lo que permite planificar su resolución en lugar de justificarla.
