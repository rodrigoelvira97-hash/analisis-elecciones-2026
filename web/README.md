# Visor web del análisis electoral

Web estática local para consultar el análisis de 2023. La navegación es progresiva y orientada al votante: primero ofrece dos caminos —explorar un programa o comparar por tema—, después muestra índices y subtemas, y solo al entrar en un nodo concreto muestra las propuestas y permite abrir el PDF original.

## Abrirla

Opción rápida: abrir `index.html` en el navegador.

Opción recomendada: desde la raíz del proyecto ejecutar:

```powershell
node web/server.mjs
```

Después abrir:

`http://localhost:8000/web/`

La segunda opción facilita que los enlaces relativos a los PDF funcionen correctamente.

## Estructura

- `index.html`: estructura de la interfaz.
- `styles.css`: diseño responsive.
- `pdf-viewer.html`, `pdf-viewer.js` y `pdf-viewer.css`: visor interno para abrir una página concreta del PDF también en móviles.
- `data-2023.js`: datos del análisis y referencias a páginas PDF.
- `program-structure-2023.js`: índice original de cada programa, con sus bloques y apartados principales.
- `app.js`: filtros, tarjetas, buscador tolerante y ventana de detalle.

La aplicación mantiene dos capas separadas. El panel `Índice original del programa` conserva la estructura propia de cada documento: bloques, capítulos y apartados principales tal como aparecen en su índice. La taxonomía comparativa separa esa estructura original de los temas madre y subtemas comunes de comparación. El selector jerárquico muestra cada tema como una opción que incluye sus subtemas activos y permite entrar en un subtema concreto. La vista de un subtema presenta primero una comparación resumida por partido —recuento y ejemplos de títulos— y mantiene el listado completo de propuestas cerrado hasta que el usuario abre ese partido. La interfaz explica el alcance de la clasificación seleccionada con lenguaje comprensible. El tema clasifica el ámbito principal de la propuesta; el subtema permite concretar la búsqueda sin convertir categorías distintas —por ejemplo, vivienda, territorio, soberanía o movilidad— en un único grupo. Las etiquetas secundarias permiten que una propuesta pueda pertenecer a más de un subtema cuando el propio contenido lo justifica.

Los bloques originales, los bloques analíticos y las medidas se muestran como niveles distintos para los cuatro programas. La ruta por programa es `partido → índice original → bloque o capítulo → medidas`. La ruta comparativa es `tema madre → subtema → medidas de los partidos seleccionados`. La pantalla inicial no lista el grueso de las medidas: solo ofrece los índices, los temas, los subtemas y sus contadores. La búsqueda libre sí funciona como entrada directa a las medidas coincidentes porque constituye una petición explícita del usuario.

Las medidas/propuestas extraídas del PDF aparecen separadas de las síntesis analíticas que ya existían en la línea base. Cada registro documental conserva su página, su numeración original cuando existe, su sección y el bloque original del índice al que se ha vinculado. La extracción se genera desde los cuatro PDF de 2023 mediante `tools/build_source_catalog_2023.py`, de modo que el mismo criterio pueda repetirse al incorporar 2026.

La búsqueda se evalúa a nivel de medida: la prioridad se conserva como contexto, pero solo se muestran las medidas coincidentes. Ignora tildes y admite términos relacionados controlados; así, `inmigración` no devuelve automáticamente todas las medidas de seguridad, fronteras o personas. Las etiquetas de migración incluyen, entre otros, inmigración, migración, asilo, refugio, extranjería e integración, siempre que la medida esté etiquetada documentalmente como tal.

El orden visual de los partidos es PP, PSOE, VOX y SUMAR, siguiendo la representación parlamentaria indicada para esta comparación. Los enlaces de página no dependen únicamente del fragmento `#page=` del navegador: abren el visor interno basado en PDF.js y ofrecen como alternativa el PDF completo del dispositivo.

El orden de los temas y subtemas es de navegación y no representa un ranking de importancia. Cada medida se etiqueta individualmente para evitar que la selección arrastre una prioridad completa.

## Cómo se actualizará en 2026

La interfaz no debería reescribirse. Se añadirá un nuevo archivo de datos, por ejemplo `data-2026.js`, o se ampliará el modelo para incluir ambos años. Cada medida debe conservar:

- Partido.
- Año.
- Tema y prioridad.
- Resumen de la medida.
- Archivo PDF de origen.
- Página PDF.

Así cada nueva medida podrá mostrar el resumen y enlazar directamente al texto completo del programa original.
