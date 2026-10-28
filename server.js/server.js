
const http = require("http");

let scores = { rouge: 0, bleu: 0 };

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.url === "/scores" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(scores));
  }

  if (req.url === "/vote" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const vote = String(data.vote || "").toLowerCase();

        if (vote === "rouge" || vote === "bleu") {
          scores[vote]++;
          res.writeHead(200, {
            "Content-Type": "application/json"
          });
          return res.end(JSON.stringify({ ok: true, scores }));
        }

        res.writeHead(400);
        res.end(JSON.stringify({ error: "Vote invalide" }));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "JSON invalide" }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(process.env.PORT || 3000, "0.0.0.0");
