# Visor de programas electorales de 2026

Web estática para explorar los cuatro programas de 2026 exclusivamente desde sus PDF locales.

## Abrir

Desde la carpeta raíz del proyecto:

```powershell
node web/server.mjs
```

Abre `http://localhost:8000/web/` en el navegador. El visor integrado dirige a la página física del PDF y ofrece un enlace alternativo al archivo completo.

## GitHub Pages y móviles

La web se publica desde la raíz del repositorio en la rama `main`; se abre en `/web/` y los PDF permanecen en la raíz. Los enlaces del visor se construyen con rutas relativas al proyecto, así funcionan también bajo la subruta que GitHub Pages asigna a este repositorio. La página raíz redirige a la web.

El visor carga PDF.js desde cdnjs para renderizar la página solicitada dentro del navegador. Si falla esa carga, el enlace «Abrir PDF completo» ya contiene el archivo y la página solicitada para usar el visor PDF del dispositivo. La guía de PDF.js documenta tanto las compilaciones preconstruidas como la distribución por CDN. [Guía oficial de PDF.js](https://github.com/mozilla/pdf.js/wiki/setup-pdf.js-in-a-website)

## Archivos principales

- `index.html`: interfaz y carga de datos de 2026.
- `app.js` y `styles.css`: navegación, comparación y presentación adaptable a móvil.
- `data-2026.js`: temas madre, subtemas y definiciones de alcance.
- `program-structure-2026.js`: índices originales, bloques y apartados de los programas.
- `source-catalog-2026.js`: referencias extraídas, con texto, página, bloque, apartado y etiquetas.
- `measure-relations-2026.js`: sugerencias locales de medidas de otros partidos para revisar.
- `pdf-viewer.html`, `pdf-viewer.js` y `pdf-viewer.css`: visor PDF con selección de página.

Los datos se regeneran con `python tools/build_source_catalog_2026.py`. El script lee únicamente los cuatro PDF nombrados en su configuración y produce los tres catálogos JavaScript de 2026. No llama a servicios externos.

La ruta por partido conserva el índice propio de cada programa. La ruta temática usa una clasificación común del proyecto. Las referencias extraídas no equivalen siempre a una propuesta numerada: el PP y el Frente Amplio tienen formatos de extracción distintos, así que sus recuentos no deben compararse como volumen o prioridad.

Las relaciones son candidatas automáticas que requieren comprobación en el PDF. La aplicación explica que la coincidencia no implica equivalencia, oposición o respuesta directa y que no encontrar una candidata no demuestra ausencia.
