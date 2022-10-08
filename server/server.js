import express from "express";
import http from "http";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { socketSetUp } from "./socket-io.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "../client/build")));

socketSetUp(server);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
