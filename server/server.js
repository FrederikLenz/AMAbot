import fs from "node:fs/promises";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);


const topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};

function resetTopicStats() {
  topicStats.navn = 0;
  topicStats.bosted = 0;
  topicStats.fritid = 0;
}



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});