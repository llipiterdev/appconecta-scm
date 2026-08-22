# Roles, responsabilidades y matriz RACI

## Declaración previa sobre la ejecución

Este documento describe la **estructura organizacional de la consultora** que desarrolla y
mantiene AppConecta. Conviene decir sin rodeos cómo se relaciona esa estructura con lo que ocurrió
realmente en el repositorio:

> Los roles representan la estructura organizacional de la consultora. Para garantizar
> automatización y reproducibilidad, la ejecución técnica en GitHub fue centralizada mediante una
> sola identidad.

Esto significa que **todos los commits, pull requests y merges del repositorio fueron ejecutados
por una única cuenta**. No se han fabricado revisores, aprobaciones ni conversaciones de revisión
que no ocurrieron. La matriz RACI describe cómo se distribuiría la responsabilidad en la
consultora, no una traza de acciones ejecutadas por personas distintas.

Lo que sí opera con independencia del autor es el conjunto de validaciones automáticas del
pipeline: nadie puede complacerlas escribiendo su propio código. Esa es la separación de control
realmente existente en el proyecto.

## Integrantes

| Integrante                      | Rol organizacional principal     | Rol secundario              |
| ------------------------------- | -------------------------------- | --------------------------- |
| Miguel Santiago Acevedo Virgues | Representante del cliente / RRHH | Miembro del CCB             |
| Julian Camilo Corredor Rojas    | Responsable SCM                  | Miembro del CCB, revisión   |
| Brayan Estif Calderon Gomez     | Responsable DevOps               | Miembro del CCB, desarrollo |

Docente de la asignatura: Cesar Augusto Vega Fernandez.

## Roles definidos

| Rol                                | Responsabilidad principal                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| **Representante del cliente/RRHH** | Define necesidades, prioriza el backlog y acepta las entregas                            |
| **Líder de consultoría**           | Coordina el alcance, la planificación y la comunicación con el cliente                   |
| **Desarrollo**                     | Implementa las funcionalidades y las pruebas                                             |
| **Revisión**                       | Verifica calidad, cobertura y cumplimiento de convenciones                               |
| **Responsable SCM**                | Custodia Configuration Items, baselines, trazabilidad y el proceso de control de cambios |
| **Responsable DevOps**             | Diseña y mantiene el pipeline, el despliegue y la infraestructura de automatización      |
| **Comité de Control de Cambios**   | Evalúa y autoriza los cambios mayores y los que afectan a una baseline establecida       |

**No se define un rol de inteligencia artificial.** El inventario de Configuration Items no
contiene ningún CI de IA, y crear un rol sin un CI que gobernar sería una figura vacía. El uso de
herramientas de asistencia se declara en `AGENTS.md` como lo que es: una herramienta de trabajo,
no un miembro de la organización con responsabilidades asignadas.

## Matriz RACI

**R** responsable de ejecutar · **A** rinde cuentas · **C** consultado · **I** informado

| Actividad                                     | Cliente/RRHH | Líder | Desarrollo | Revisión | SCM     | DevOps  | CCB   |
| --------------------------------------------- | ------------ | ----- | ---------- | -------- | ------- | ------- | ----- |
| Definir el alcance de la simulación           | C            | **A** | I          | I        | R       | I       | C     |
| Priorizar el backlog                          | **A**        | R     | C          | I        | C       | I       | I     |
| Crear y mantener issues                       | C            | R     | R          | I        | **A**   | I       | I     |
| Redactar un RFC                               | R            | C     | C          | I        | **A**   | C       | C     |
| Evaluar el impacto de un cambio               | C            | C     | C          | C        | R       | C       | **A** |
| Aprobar un cambio mayor                       | R            | C     | I          | I        | R       | R       | **A** |
| Diseñar la arquitectura                       | I            | C     | R          | C        | C       | C       | I     |
| Implementar funcionalidades                   | I            | I     | **A**/R    | C        | I       | I       | I     |
| Escribir pruebas automatizadas                | I            | I     | R          | **A**    | I       | I       | I     |
| Revisar un pull request                       | I            | I     | C          | **A**/R  | C       | C       | I     |
| Definir la estrategia de ramas                | I            | C     | C          | C        | **A**/R | C       | I     |
| Aplicar versionamiento semántico              | I            | C     | I          | I        | **A**/R | C       | I     |
| Mantener el inventario de Configuration Items | I            | I     | C          | I        | **A**/R | C       | I     |
| Establecer una baseline                       | I            | C     | I          | C        | **A**/R | C       | C     |
| Mantener la matriz de trazabilidad            | I            | I     | C          | C        | **A**/R | C       | I     |
| Registrar deuda técnica                       | I            | I     | R          | R        | **A**   | I       | I     |
| Diseñar el pipeline CI                        | I            | I     | C          | C        | C       | **A**/R | I     |
| Diseñar el pipeline CD                        | I            | I     | I          | I        | C       | **A**/R | I     |
| Configurar la protección de ramas             | I            | I     | I          | I        | **A**/R | C       | I     |
| Ejecutar una release                          | I            | C     | I          | C        | **A**/R | R       | C     |
| Publicar una imagen de contenedor             | I            | I     | I          | I        | C       | **A**/R | I     |
| Verificar el despliegue                       | C            | I     | I          | C        | C       | **A**/R | I     |
| Recopilar evidencias                          | I            | C     | I          | C        | **A**/R | R       | I     |
| Aceptar una entrega                           | **A**/R      | C     | I          | I        | C       | I       | C     |
| Planificar la intervención de mantenimiento   | C            | C     | R          | C        | **A**   | C       | C     |

## Responsabilidad sobre los Configuration Items

| Categoría de CI                  | Propietario     | Aprueba cambios                     |
| -------------------------------- | --------------- | ----------------------------------- |
| Código de aplicación             | Desarrollo      | Revisión, mediante PR con CI        |
| Configuración técnica            | DevOps          | Responsable SCM, mediante PR con CI |
| Pruebas                          | Revisión        | Revisión, mediante PR con CI        |
| Automatización CI/CD             | DevOps          | Responsable SCM, mediante PR con CI |
| Documentación y gobierno         | Responsable SCM | Líder de consultoría                |
| Artefactos de entrega            | Responsable SCM | Comité de Control de Cambios        |
| Sistemas externos (conceptuales) | Cliente / TI    | No aplica: no implementados         |

## Cómo se distribuiría el trabajo en la consultora

La correspondencia entre las fases del proyecto y los roles que las lideran, conforme al modelo
organizacional:

| Fase                                | Rol que lidera  | Roles que participan      |
| ----------------------------------- | --------------- | ------------------------- |
| Bootstrap del repositorio           | Responsable SCM | DevOps                    |
| Shell y navegación de la aplicación | Desarrollo      | Revisión                  |
| Módulos funcionales del portal      | Desarrollo      | Revisión, Responsable SCM |
| Gobierno SCM                        | Responsable SCM | Líder, CCB                |
| Pipeline CI completo                | DevOps          | Responsable SCM, Revisión |
| Release v0.1.0                      | Responsable SCM | DevOps, Cliente           |
| Carné virtual QR                    | Desarrollo      | CCB, Cliente, Revisión    |
| Pipeline CD                         | DevOps          | Responsable SCM           |
| Release v0.2.0                      | Responsable SCM | DevOps, Cliente, Líder    |

Esta tabla describe la asignación organizacional del modelo, no una traza de quién ejecutó cada
comando. La ejecución técnica se centralizó, como se declara al inicio del documento.
