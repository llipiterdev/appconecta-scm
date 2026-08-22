# Unidad 1 — Análisis de evolución, deuda técnica y mantenimiento de AppConecta

> **Alcance de este documento.** Recoge el diagnóstico de la Actividad 1 y lo conecta con lo
> implementado en este repositorio. El escenario que describe —una aplicación con años de
> operación, integraciones corporativas y usuarios reales— es un **supuesto académico** del caso
> de estudio, no una descripción de hechos. Lo que existe realmente es la simulación funcional
> descrita en `docs/architecture.md`.

## 1. Caracterización del sistema

AppConecta se define en el caso de estudio como una aplicación móvil corporativa cuyo propósito es
centralizar los procesos de Recursos Humanos y la comunicación interna, evitando que el
colaborador tenga que recurrir a canales dispersos —correo, mesa de ayuda, ventanilla física— para
gestiones rutinarias.

| Dimensión       | Caracterización del caso de estudio                                                       |
| --------------- | ----------------------------------------------------------------------------------------- |
| Tipo de sistema | Aplicación móvil corporativa de uso interno                                               |
| Usuarios        | Colaboradores de la organización                                                          |
| Dominio         | Recursos Humanos y comunicación interna                                                   |
| Criticidad      | Media-alta: no detiene la operación, pero su indisponibilidad genera carga administrativa |
| Integraciones   | Nómina, RRHH, autenticación corporativa, gestión documental                               |

### Funcionalidades del caso de estudio

| Funcionalidad                           | Estado en esta simulación                |
| --------------------------------------- | ---------------------------------------- |
| Documentos laborales                    | Implementada con datos ficticios         |
| Desprendibles de nómina                 | Implementada con datos ficticios         |
| Solicitudes de Recursos Humanos         | Implementada con persistencia local      |
| Incapacidades                           | Implementada con persistencia local      |
| Noticias y anuncios                     | Implementada con datos ficticios         |
| Reconocimientos                         | No implementada                          |
| Mesa de ayuda                           | No implementada                          |
| Integraciones con sistemas corporativos | Simuladas mediante adaptadores en código |
| Carné virtual QR                        | Prevista para v0.2.0 (RFC-001)           |
| Notificaciones push                     | Backlog futuro                           |
| Bonos con comercios aliados             | Backlog futuro                           |

## 2. Componentes y artefactos

El caso de estudio identifica cinco grupos de artefactos. Su correspondencia con el inventario de
Configuration Items de este repositorio:

| Artefacto del diagnóstico | Configuration Items correspondientes                   |
| ------------------------- | ------------------------------------------------------ |
| Cliente móvil             | `CI-APP-*`                                             |
| Servicios de integración  | `CI-APP-SVC-002` (simulado), `CI-EXT-*` (conceptuales) |
| Persistencia              | `CI-APP-STORE-001`; `CI-EXT-DB-001` conceptual         |
| Configuración y build     | `CI-CFG-*`                                             |
| Documentación             | `CI-DOC-*`                                             |

## 3. Evolución del software y leyes de Lehman

El diagnóstico interpreta la situación de AppConecta a la luz de las leyes de Lehman sobre la
evolución del software. Tres de ellas son directamente aplicables al escenario, y las tres tienen
correlato en la deuda deliberada introducida en este repositorio:

| Ley                       | Enunciado                                                                        | Manifestación en la simulación                                                                           |
| ------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Cambio continuo**       | Un sistema en uso debe adaptarse o pierde utilidad progresivamente               | El backlog de evolución existe y está registrado; la arquitectura actual dificulta atenderlo             |
| **Complejidad creciente** | La complejidad aumenta salvo que se trabaje deliberadamente para reducirla       | `processSubmission` con complejidad 26 (**TD-005**) es el resultado de acumular reglas sin reestructurar |
| **Calidad decreciente**   | La calidad percibida disminuye si no se adapta el sistema a su entorno cambiante | La dependencia estancada `moment` (**TD-007**) ilustra el envejecimiento del entorno técnico             |

La segunda ley merece una precisión que suele perderse: no dice que la complejidad crezca porque
los desarrolladores sean descuidados. Dice que crece **por defecto**, y que mantenerla acotada
requiere trabajo deliberado que compite por los mismos recursos que las funcionalidades nuevas.
Esa competencia es exactamente el conflicto que la Actividad 4 debe resolver con evidencia.

## 4. Deuda técnica

El diagnóstico identifica seis categorías de deuda en AppConecta. La simulación las materializa en
nueve deudas concretas y medidas:

| Categoría del diagnóstico | Deudas implementadas y medidas                                   |
| ------------------------- | ---------------------------------------------------------------- |
| Deuda de arquitectura     | TD-001, TD-002, TD-008, TD-009                                   |
| Deuda de código           | TD-003, TD-004, TD-005                                           |
| Deuda de pruebas          | TD-006                                                           |
| Deuda de dependencias     | TD-007                                                           |
| Deuda de documentación    | Resuelta: el proyecto documenta su configuración                 |
| Deuda de infraestructura  | Resuelta: el pipeline es reproducible sin infraestructura propia |

Las dos últimas categorías se resuelven en lugar de simularse. Introducir deuda documental en un
proyecto cuyo entregable **es** la documentación de su gestión de configuración sería
contradictorio, y no dejaría nada medible.

El registro completo, con los diecisiete atributos de cada deuda y sus métricas reales, vive en
`docs/technical-debt-register.md`.

## 5. Envejecimiento del software

El envejecimiento se distingue de la deuda técnica en su origen: la deuda se contrae por
decisiones propias, el envejecimiento ocurre porque **el entorno cambia mientras el software
permanece igual**. Un sistema puede envejecer sin que nadie toque una línea de su código.

| Factor de envejecimiento              | Presencia en la simulación                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| Obsolescencia de dependencias         | `moment` en estado de mantenimiento (**TD-007**), sin vulnerabilidades a día de hoy |
| Erosión de la arquitectura            | Ausencia de capa de dominio (**TD-009**)                                            |
| Deterioro del conocimiento            | Mitigado mediante ADR, RFC y el registro de deuda                                   |
| Desajuste con las expectativas de uso | La PWA responde al patrón de uso móvil actual                                       |

`moment` es el caso ilustrativo: la biblioteca **no está rota**. Funciona, no tiene
vulnerabilidades y su versión instalada es la última publicada. El problema es que no evolucionará
más, y el entorno alrededor sí. Es la diferencia entre una dependencia vulnerable —que exige
respuesta inmediata— y una dependencia estancada, que exige planificación.

## 6. Tipos de mantenimiento previstos

| Tipo           | Definición                                          | Aplicación prevista en AppConecta                             |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| **Correctivo** | Corregir defectos detectados                        | Ramas `fix/*` y `hotfix/*`; ninguno registrado hasta la fecha |
| **Adaptativo** | Ajustar el sistema a cambios de su entorno          | TD-008: adaptar los contratos de integración                  |
| **Perfectivo** | Mejorar atributos de calidad o añadir funcionalidad | TD-003, TD-004; carné virtual QR (RFC-001)                    |
| **Preventivo** | Reducir el riesgo de fallos futuros                 | TD-001, TD-002, TD-005, TD-006, TD-007, TD-009                |

Seis de las nueve deudas requieren mantenimiento **preventivo**. Esa proporción es informativa: el
sistema no falla, y sin embargo la mayor parte del trabajo pendiente busca evitar que falle. El
mantenimiento preventivo es el más difícil de justificar ante un cliente precisamente porque
previene algo que todavía no ha ocurrido, y es el que la Actividad 4 debe defender con métricas en
lugar de con argumentos.

## 7. Riesgos identificados

| Riesgo                                                       | Probabilidad | Impacto | Deuda asociada | Mitigación implementada                                     |
| ------------------------------------------------------------ | ------------ | ------- | -------------- | ----------------------------------------------------------- |
| Un defecto en el servicio legacy afecta a todos los módulos  | Media        | Alto    | TD-001, TD-005 | Pruebas de los flujos críticos; refactorización planificada |
| Divergencia entre validaciones duplicadas                    | Media        | Medio   | TD-003         | Detección automática de duplicación en el pipeline          |
| Un defecto en un módulo secundario no se detecta             | Media        | Medio   | TD-006         | Control de no regresión de cobertura                        |
| Una dependencia estancada acaba presentando vulnerabilidades | Baja         | Alto    | TD-007         | `npm audit` en cada ejecución de CI; Dependabot activo      |
| Un cambio en un sistema externo rompe la integración         | Media        | Medio   | TD-008         | Adaptadores explícitos planificados                         |
| La deuda crece sin registro                                  | Media        | Alto    | Todas          | Registro obligatorio `TD-xxx` en la plantilla de PR         |

## 8. Impacto en atributos de calidad

Efecto de la deuda registrada sobre los atributos de calidad de la norma ISO/IEC 25010:

| Atributo                | Efecto  | Deudas responsables            | Evidencia medida                                             |
| ----------------------- | ------- | ------------------------------ | ------------------------------------------------------------ |
| **Mantenibilidad**      | Alto    | TD-001, TD-004, TD-005, TD-009 | Complejidad 26 en una función de 204 líneas                  |
| **Capacidad de prueba** | Alto    | TD-002, TD-005                 | Las reglas de negocio exigen entorno DOM para probarse       |
| **Modificabilidad**     | Alto    | TD-003, TD-008                 | Un cambio de regla exige tocar dos copias                    |
| **Portabilidad**        | Medio   | TD-002, TD-008                 | Migrar la persistencia exigiría reescribir reglas de negocio |
| **Fiabilidad**          | Medio   | TD-006                         | Cobertura de ramas del 75 %                                  |
| **Seguridad**           | Ninguno | —                              | 0 vulnerabilidades en todas las severidades                  |
| **Funcionalidad**       | Ninguno | —                              | Las 60 pruebas pasan; la aplicación opera correctamente      |

Las dos últimas filas son el punto que hace útil todo el ejercicio. **La deuda no degrada la
funcionalidad ni la seguridad.** El sistema funciona, es seguro y el pipeline termina en verde. La
deuda no se manifiesta como un fallo sino como un **costo de cambio**, invisible hasta que alguien
intenta modificar algo. Por eso hay que medirla: es lo único que la hace visible antes de que se
cobre.

## 9. Continuidad hacia las siguientes actividades

| Actividad   | Aporte del diagnóstico de la Unidad 1                                             |
| ----------- | --------------------------------------------------------------------------------- |
| Actividad 2 | Los artefactos identificados se convierten en Configuration Items con propietario |
| Actividad 3 | Las deudas se materializan, se miden y se registran con baseline real             |
| Actividad 4 | La baseline medida permite demostrar la mejora con métricas antes y después       |
