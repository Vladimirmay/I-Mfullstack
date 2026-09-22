const http = require("http");

const TARGET_PORT = process.env.PORT_CONNECTION || 3000;
const PROXY_PORT = 4000;
const TIMEOUT_MS = 500;

const server = http.createServer((clientReq, clientRes) => {
  const proxyReq = http.request(
    {
      hostname: "localhost",
      port: TARGET_PORT,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers,
      timeout: TIMEOUT_MS,
    },
    (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes);
    },
  );

  proxyReq.on("timeout", () => {
    proxyReq.destroy();
    if (!clientRes.headersSent) {
      clientRes.writeHead(504, { "Content-Type": "text/plain" });
      clientRes.end("504 Gateway Timeout");
    }
  });

  proxyReq.on("error", () => {
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { "Content-Type": "text/plain" });
      clientRes.end("502 Bad Gateway");
    }
  });

  clientReq.pipe(proxyReq);
});

server.listen(PROXY_PORT, () => {
  console.log(
    `Proxy listening on http://localhost:${PROXY_PORT}, forwarding to http://localhost:${TARGET_PORT} (timeout ${TIMEOUT_MS}ms)`,
  );
});
