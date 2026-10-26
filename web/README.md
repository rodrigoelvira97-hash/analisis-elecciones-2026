# Visor web del análisis electoral

Web estática local para consultar el análisis de 2023. Permite filtrar por uno o varios partidos, tema madre, subtema y texto, y abrir cada medida en la página correspondiente del PDF original.

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
- `data-2023.js`: datos del análisis y referencias a páginas PDF.
- `app.js`: filtros, tarjetas, buscador tolerante y ventana de detalle.

La taxonomía separa el nombre original de la prioridad del partido de los temas madre y subtemas comunes de comparación. El selector jerárquico muestra cada tema madre como una opción que incluye todos sus subtemas y, dentro del mismo desplegable, permite seleccionar un subtema concreto. La interfaz explica el alcance de la clasificación seleccionada: qué incluye y qué queda fuera. El tema madre clasifica el ámbito principal de la medida; el subtema permite concretar la búsqueda sin convertir categorías distintas —por ejemplo, vivienda, territorio, soberanía o movilidad— en un único grupo. Las etiquetas secundarias permiten que una medida pueda pertenecer a más de un subtema cuando el propio contenido lo justifica.

Los bloques temáticos y las medidas se muestran como niveles distintos para los cuatro programas. Las medidas/propuestas extraídas del PDF aparecen separadas de las síntesis analíticas que ya existían en la línea base. Cada registro documental conserva su página y, cuando el programa lo proporciona, su numeración original. La extracción se genera desde los cuatro PDF de 2023 mediante `tools/build_source_catalog_2023.py`, de modo que el mismo criterio pueda repetirse al incorporar 2026.

La búsqueda se evalúa a nivel de medida: la prioridad se conserva como contexto, pero solo se muestran las medidas coincidentes. Ignora tildes y admite términos relacionados controlados; así, `inmigración` no devuelve automáticamente todas las medidas de seguridad, fronteras o personas. Las etiquetas de migración incluyen, entre otros, inmigración, migración, asilo, refugio, extranjería e integración, siempre que la medida esté etiquetada documentalmente como tal.

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
