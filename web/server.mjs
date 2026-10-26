import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = normalize(fileURLToPath(new URL("..", import.meta.url))).replace(/[\\/]+$/, "");
const port = Number(process.env.PORT || 8000);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
};

function safePath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  const relativePath = pathname === "/" ? "web/index.html" : pathname.replace(/^\/+/, "");
  const candidate = normalize(join(projectRoot, relativePath));
  if (candidate !== projectRoot && !candidate.startsWith(projectRoot + sep)) return null;
  return candidate;
}

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  try {
    let filePath = safePath(request.url);
    if (!filePath) {
      response.writeHead(400);
      response.end("Bad request");
      return;
    }

    let fileInfo = await stat(filePath);
    if (fileInfo.isDirectory()) {
      filePath = join(filePath, "index.html");
      fileInfo = await stat(filePath);
    }

    const contentType = contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Length": fileInfo.size,
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Visor electoral disponible en http://127.0.0.1:${port}/web/`);
});
