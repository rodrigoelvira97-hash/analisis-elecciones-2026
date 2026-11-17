# Análisis electoral 2026

Proyecto de análisis documental comparativo dedicado a los programas electorales de 2026. La web y los informes activos utilizan únicamente los cuatro PDF de esta edición guardados en la carpeta raíz.

## Abrir el visor

Desde la carpeta raíz, ejecuta:

```powershell
node web/server.mjs
```

Después abre `http://localhost:8000/web/`. También se puede abrir `web/index.html` directamente, aunque el servidor local es más fiable para los enlaces a páginas concretas de los PDF.

## Abrir desde cualquier dispositivo

La web está preparada para GitHub Pages. La dirección pública del análisis es:

<https://rodrigoelvira97-hash.github.io/analisis-elecciones-2026/web/>

La raíz del sitio redirige a `/web/`, por lo que también se puede compartir la dirección base del repositorio. En GitHub, la publicación debe usar la rama `main` y la carpeta `/(root)`. Los PDF deben permanecer en la raíz del repositorio; la web resuelve sus enlaces desde ahí. GitHub Pages permite publicar desde la raíz de una rama o desde `/docs` y despliega los cambios que se suben a la fuente configurada. [Documentación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

El visor integrado usa PDF.js desde cdnjs para mostrar la página concreta dentro de la web. Si esa biblioteca no carga en un dispositivo, queda disponible el enlace al PDF original para abrirlo en el visor del navegador o del sistema.

## Cómo se organiza la consulta

- **Por partido:** índice original → bloque o apartado → referencias extraídas del documento.
- **Por tema:** tema madre → subtema → comparación resumida por partido → referencias agrupadas según el índice original.
- **Por medida:** abre la ficha para ver su texto extraído, la sección del programa, el PDF en la página de referencia y posibles propuestas relacionadas de los demás partidos.

El índice original y la clasificación temática son capas distintas. Las etiquetas temáticas son una clasificación documental del proyecto, no categorías oficiales de los partidos.

Las sugerencias de propuestas relacionadas se calculan localmente a partir del subtema y de términos compartidos entre medidas. Son candidatas para revisar en los PDF: no prueban que dos propuestas sean equivalentes, opuestas o una respuesta directa. La falta de sugerencias tampoco demuestra que un documento no trate el asunto. La web no consulta fuentes políticas externas; el visor usa PDF.js como dependencia técnica para representar los documentos.

## Fuentes y límites

- Frente Amplio: `Frente-Amplio-PROGRAMA 2026.pdf`
- PP: `PP-PROGRAMA 2026.pdf`
- PSOE: `PSOE-programa 2026.pdf`
- VOX: `VOX-PROGRAMA 2026.pdf`

La web no consulta Internet ni servicios externos. Las cifras de referencias no son directamente comparables: algunos documentos numeran propuestas y el del Frente Amplio se ha extraído por viñetas. Las páginas que aparecen como `PDF p.` son páginas físicas del archivo; el índice original conserva la paginación impresa cuando está disponible.

Consulta el [inventario y método de 2026](analisis/inventario-metodo-2026.md) para ver el detalle de las fuentes y la extracción.
