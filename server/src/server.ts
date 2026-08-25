import express from "express";
import { setupWebSocket } from "./webSocket.js";

const app = express();

const PORT = 3000;

app.get("/", (_req, res) => {
  res.json({
    message: "PeerCall server is running",
  });
});

const server = app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});

setupWebSocket(server);