import express from "express";
import { setupWebSocket } from "./webSocket.js";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.get("/", (_req, res) => {
  res.json({
    message: "PeerCall server is running",
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP server running on port ${PORT}`);
});

setupWebSocket(server);