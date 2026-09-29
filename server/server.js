import express from "express";
import path from "node:path";
import cors from "cors";
import { fileURLToPath } from "node:url";
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);

app.use((request, response) => {
  response.status(404).json({ error: "Siden findes ikke." });
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ error: "Noget gik galt på serveren." });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});