# Análisis elecciones 2026

Proyecto de análisis documental comparativo de programas electorales.

## Fuentes actuales

La carpeta contiene actualmente los programas de 2023 de:

- PP
- PSOE
- SUMAR
- VOX

Los programas de 2026 deberán añadirse sin eliminar ni sustituir los documentos de 2023.

## Cómo trabajar con el proyecto

1. Añade los nuevos PDF a esta carpeta.
2. Mantén en el nombre del archivo el partido, el tipo de elección y el año. Ejemplo: `PP-GENERALES-2026.pdf`.
3. Abre un chat dentro de este proyecto y pide el análisis o la actualización.
4. Indica si quieres un análisis individual, una matriz comparativa o una comparación 2023–2026.
5. Revisa siempre las referencias de página antes de utilizar el resultado públicamente.

## Petición recomendada para actualizar el proyecto

> He añadido nuevos programas electorales a la carpeta. Haz un inventario de los documentos, identifica los archivos nuevos, analiza únicamente su contenido y actualiza la comparativa 2023–2026. Conserva la información anterior, no sobrescribas los análisis existentes y cita partido, año, archivo y página siempre que sea posible.

## Organización recomendada para los resultados

Cuando se empiecen a generar informes, se recomienda guardar los resultados en una carpeta `analisis/` y utilizar nombres con año y fecha, por ejemplo:

- `analisis/prioridades-2023.md`
- `analisis/comparativa-2023.md`
- `analisis/comparativa-2023-2026.md`

No se crea ni actualiza automáticamente ningún informe solo por añadir un PDF: la actualización debe solicitarse en un chat del proyecto o automatizarse posteriormente con un script.

## Visor web local

Existe una interfaz web en `web/` para consultar las prioridades y medidas con filtros por partido, tema y texto. Cada medida permite abrir el PDF original en la página de referencia.

Para abrirla correctamente desde la raíz del proyecto:

```powershell
node web/server.mjs
```

Después visita `http://localhost:8000/web/`.
