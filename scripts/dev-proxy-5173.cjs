const http = require('http');
const net = require('net');

const TARGET_PORT = 5899;
const PROXY_PORT = 5173;

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${TARGET_PORT}`
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.statusCode = 502;
    res.end(`Bad Gateway: Dev server on port ${TARGET_PORT} not ready yet. (${err.message})`);
  });

  req.pipe(proxyReq, { end: true });
});

// Support WebSockets (for Vite HMR)
server.on('upgrade', (req, clientSocket, head) => {
  const serverSocket = net.connect(TARGET_PORT, '127.0.0.1', () => {
    serverSocket.write(
      `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
      Object.entries(req.headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\r\n') +
      '\r\n\r\n'
    );
    if (head.length > 0) serverSocket.write(head);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
  });

  serverSocket.on('error', () => {
    clientSocket.destroy();
  });
  clientSocket.on('error', () => {
    serverSocket.destroy();
  });
});

server.listen(PROXY_PORT, '127.0.0.1', () => {
  console.log(`[Proxy] Forwarding http://127.0.0.1:${PROXY_PORT} -> http://127.0.0.1:${TARGET_PORT}`);
});
