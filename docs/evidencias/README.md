# Evidencias

Esta carpeta reúne los enlaces y las capturas que sustentan las afirmaciones del documento de la
Actividad 3. Conviene explicar qué contiene y, sobre todo, qué **no** contiene.

## Qué se versiona aquí y qué no

| Tipo de evidencia                    | Dónde vive                             | Por qué                                                                       |
| ------------------------------------ | -------------------------------------- | ----------------------------------------------------------------------------- |
| URLs de artefactos de GitHub         | `EVIDENCIAS.md`                        | La plataforma es la fuente; copiarlos aquí crearía una segunda versión        |
| Capturas de la aplicación desplegada | `capturas/`                            | La interfaz cambia con cada versión y una captura fija el estado entregado    |
| Informe de validaciones ejecutadas   | `reports/evidence/`, **no versionado** | Lo genera `npm run evidence` y debe regenerarse, no consultarse de un archivo |
| Cobertura, complejidad y duplicación | `reports/`, **no versionado**          | Son salidas de herramientas; versionarlas invitaría a editarlas a mano        |

La distinción del último renglón es deliberada. Una métrica versionada en un archivo Markdown es un
número que alguien escribió; una métrica que se regenera al ejecutar un comando es una medición. El
único archivo de métricas que sí se versiona es `metrics-baseline.json`, y no como evidencia sino
como **entrada** del control de no regresión.

## Cómo regenerar las evidencias

```bash
npm ci
npm run evidence
```

El script ejecuta las trece validaciones del proyecto y escribe `reports/evidence/evidence.md` y
`evidence.json` con el resultado real de cada una, la fecha, el commit, la versión y las métricas.

Tres propiedades del script importan más que su salida:

- **Falla si una validación obligatoria falla.** Un informe que oculta un fallo no es evidencia.
- **No corrige ni maquilla salidas.** Registra lo que ocurrió.
- **Excluye credenciales.** La URL del remoto se publica sin su parte de autenticación, porque un
  remoto puede llevar un token embebido.

Las validaciones que dependen del entorno local, las pruebas de extremo a extremo y la construcción
de la imagen, se marcan como opcionales: si no pueden ejecutarse en la máquina donde se lanza el
script, se registra el aviso en lugar de fingir que pasaron.

## Verificación independiente

Nada de lo afirmado aquí exige confiar en este repositorio. Todo puede comprobarse desde fuera:

```bash
# Historial, ramas y tags
git log --graph --decorate --oneline --all
git tag -n

# Artefacto de la entrega y su suma de verificación
gh release download v0.2.0 --repo llipiterdev/appconecta-scm
sha256sum --check appconecta-v0.2.0-dist.tar.gz.sha256

# Imagen publicada
docker pull ghcr.io/llipiterdev/appconecta-scm:0.2.0

# Aplicación desplegada
curl -I https://llipiterdev.github.io/appconecta-scm/
```
