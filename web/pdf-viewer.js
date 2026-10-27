import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

const params = new URLSearchParams(window.location.search);
const fileParam = params.get("file");
const requestedPage = Number.parseInt(params.get("page") || "1", 10);
const status = document.getElementById("pdf-status");
const loading = document.getElementById("pdf-loading");
const canvas = document.getElementById("pdf-canvas");
const pageIndicator = document.getElementById("page-indicator");
const previousPage = document.getElementById("previous-page");
const nextPage = document.getElementById("next-page");
const openOriginal = document.getElementById("open-original");

let pdfDocument;
let currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
let rendering = false;

function showError(message) {
  loading.textContent = message;
  status.textContent = "No se ha podido cargar esta página.";
  previousPage.disabled = true;
  nextPage.disabled = true;
}

async function renderPage(pageNumber) {
  if (!pdfDocument || rendering) return;
  rendering = true;
  try {
    const page = await pdfDocument.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.max(280, Math.min(window.innerWidth - 64, 1100));
    const cssScale = Math.min(availableWidth / baseViewport.width, 1.8);
    const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = page.getViewport({ scale: cssScale * deviceScale });
    const context = canvas.getContext("2d", { alpha: false });
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    canvas.style.width = `${Math.ceil(viewport.width / deviceScale)}px`;
    canvas.style.height = `${Math.ceil(viewport.height / deviceScale)}px`;
    await page.render({ canvasContext: context, viewport }).promise;
    canvas.style.display = "block";
    loading.style.display = "none";
    pageIndicator.textContent = `Página ${pageNumber} / ${pdfDocument.numPages}`;
    status.textContent = `Mostrando la página ${pageNumber} del documento original.`;
    previousPage.disabled = pageNumber <= 1;
    nextPage.disabled = pageNumber >= pdfDocument.numPages;
  } finally {
    rendering = false;
  }
}

async function changePage(pageNumber) {
  if (!pdfDocument) return;
  currentPage = Math.max(1, Math.min(pageNumber, pdfDocument.numPages));
  await renderPage(currentPage);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (!fileParam) {
  showError("Falta la referencia al documento PDF.");
} else {
  const pdfUrl = new URL(fileParam, window.location.href).href;
  openOriginal.href = `${pdfUrl}#page=${currentPage}`;
  pdfjsLib.getDocument(pdfUrl).promise
    .then((document) => {
      pdfDocument = document;
      currentPage = Math.max(1, Math.min(currentPage, pdfDocument.numPages));
      return renderPage(currentPage);
    })
    .catch((error) => {
      console.error(error);
      showError("El visor interno no ha podido cargar el PDF. Utiliza el enlace al PDF completo.");
    });
}

previousPage.addEventListener("click", () => changePage(currentPage - 1));
nextPage.addEventListener("click", () => changePage(currentPage + 1));
window.addEventListener("resize", () => { if (pdfDocument) renderPage(currentPage); });
