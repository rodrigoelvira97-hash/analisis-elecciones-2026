# Programas electorales de 2026: inventario y método

**Actualizado:** 17 de noviembre de 2026  
**Alcance:** extracción y navegación documental de los cuatro programas locales de 2026.  
**Fuentes externas:** ninguna.

## Fuentes y estructura original

| Partido | Archivo local | Páginas PDF | Páginas del índice en el PDF | Bloques del índice | Apartados listados |
|---|---|---:|---:|---:|---:|
| PP | `PP-PROGRAMA 2026.pdf` | 64 | 7 | 4 | 28 |
| PSOE | `PSOE-programa 2026.pdf` | 114 | 2–4 | 8 | 72 |
| VOX | `VOX-PROGRAMA 2026.pdf` | 66 | 5 | 13 | 0 |
| Frente Amplio | `Frente-Amplio-PROGRAMA 2026.pdf` | 151 | 3–5 | 18 | 74 |

VOX aparece con cero apartados listados porque su índice consultado organiza el documento en trece capítulos principales sin un nivel inferior registrado por el extractor. No significa que el PDF carezca de epígrafes internos.

La web permite abrir el índice original y navegar por partido → bloque → apartado → referencias extraídas. En paralelo, la clasificación común permite tema madre → subtema → referencias de los partidos seleccionados. La taxonomía común pertenece al análisis del proyecto; no se presenta como estructura oficial de los partidos.

## Referencias extraídas

| Partido | Referencias | Unidad de extracción |
|---|---:|---|
| PP | 242 | Propuestas numeradas con texto sustantivo |
| PSOE | 500 | Compromisos numerados |
| VOX | 115 | Propuestas numeradas |
| Frente Amplio | 908 | Medidas o enunciados extraídos de viñetas |

El PP presenta siete números ocupados por avisos promocionales que invitan a consultar nuevas medidas durante la campaña. No contienen una propuesta documental desarrollada y se excluyen del catálogo; por eso el extractor localiza 242 referencias sustantivas dentro de una secuencia que llega hasta el número 249. El PSOE y VOX conservan las numeraciones completas del 1 al 500 y del 1 al 115, respectivamente.

Las cifras no son directamente comparables como número de medidas, extensión, prioridad o importancia. En particular, las 908 unidades del Frente Amplio proceden de viñetas, no de una numeración equivalente a la de PSOE o VOX. Una viñeta puede contener más de una actuación y una propuesta puede extenderse en varios párrafos.

## Clasificación temática

Las referencias se etiquetan individualmente con los temas madre y subtemas definidos en `web/data-2026.js`. La etiqueta depende del título y de expresiones concretas del texto de la medida; el nombre general de un bloque no se propaga automáticamente a todas sus propuestas. Hay excepciones delimitadas cuando el índice original identifica explícitamente un capítulo temático —por ejemplo, los capítulos de inmigración, vivienda, sanidad o justicia de VOX y algunos bloques específicos del Frente Amplio—. Se han afinado expresiones para evitar, por ejemplo, confundir “Fiscalía” con fiscalidad, sanidad animal con la sanidad pública o una acogida genérica con acogida de personas migrantes.

Las etiquetas no sustituyen el índice original ni son categorías oficiales. Una medida puede recibir más de un subtema cuando su contenido desarrolla actuaciones relevantes en varios ámbitos. Las asignaciones automáticas son una ayuda de navegación; cuando una etiqueta resulte discutible, el texto y el PDF deben primar sobre la clasificación.

## Sugerencias de propuestas relacionadas

Al abrir una referencia, la web puede sugerir medidas de otros partidos de 2026. El procesamiento es local: exige un subtema compartido, términos poco frecuentes del contenido y un umbral de similitud textual. No se consultan servicios de IA, Internet ni fuentes distintas de los cuatro PDF.

Estas sugerencias son candidatas para revisar, no conclusiones semánticas. La coincidencia no demuestra que dos medidas sean equivalentes, opuestas o una respuesta directa. La ausencia de sugerencias tampoco demuestra que otro partido no trate el asunto. Cada ficha incluye título, extracto, partido, página y enlace al PDF para comprobar el contexto.

## Trazabilidad y limitaciones

- Los archivos de datos conservan el nombre del PDF, la página física del archivo, la numeración de la propuesta cuando existe, y su bloque y apartado original cuando pueden asignarse.
- La paginación impresa que aparece en el índice puede diferir de `PDF p.`, que es la página física usada por el enlace del visor.
- El texto se extrae con `pypdf`. Guiones de fin de línea y saltos se normalizan, pero la capa de texto puede conservar errores; el PDF original es la referencia definitiva.
- La clasificación y las relaciones automáticas necesitan revisión documental antes de usarse para sostener una conclusión pública.
- No se afirma que un partido rechace o apoye una propuesta por no encontrar una referencia clasificada. Solo tras verificar el documento completo procede usar: “No se menciona en el documento proporcionado.”
- Este informe y la web activa corresponden únicamente a los programas de 2026. No se incluyen catálogos, informes ni comparativas de otras ediciones.

## Regeneración local

Si se reemplaza o corrige uno de los PDF, actualiza los nombres o la configuración en `tools/build_source_catalog_2026.py` y ejecuta desde la carpeta raíz:

```powershell
python tools/build_source_catalog_2026.py
```

El script vuelve a generar `web/program-structure-2026.js`, `web/source-catalog-2026.js` y `web/measure-relations-2026.js` usando únicamente los cuatro archivos locales configurados.
