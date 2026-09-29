import express from "express";
import fs from "node:fs/promises";
import { findBestAnswer } from "./answers.js";

const router = express.Router();

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function loadMessages() {
  try {
    const data = await fs.readFile("./data/messages.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Kunne ikke læse beskeder", { cause: error });
  }
}

export async function saveMessages(messages) {
  const json = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", json);
}

router.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.json(messages);
});

router.post("/", async (request, response) => {
  const messages = await loadMessages();
  const question = request.body.question.trim();

  if (!question) {
    response.status(400).json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  if (question.length > 280) {
    response.status(400).json({ error: "Spørgsmålet må højst være 280 tegn." });
    return;
  }

  const message = { type: "question", text: escapeHtml(question), createdAt: new Date().toISOString() };
  messages.push(message);

  const result = await findBestAnswer(question);
  const answerMessage = { type: "answer", text: escapeHtml(result.answer), createdAt: new Date().toISOString() };
  messages.push(answerMessage);

  await saveMessages(messages);

  response.status(201).json({ question: message, answer: answerMessage });
});

router.delete("/", async (request, response) => {
  await saveMessages([]);

  response.status(204).send();
});

export default router;