const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 5500);
const host = '127.0.0.1';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.cjs': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf'
};

function resolveRequestPath(requestUrl) {
  const urlPath = decodeURIComponent((requestUrl || '/').split('?')[0]);
  const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = path.normalize(path.join(root, requestedPath));

  return filePath.startsWith(root) ? filePath : null;
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);

  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
    });
    response.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`Portfolio running at http://${host}:${port}/`);
});
