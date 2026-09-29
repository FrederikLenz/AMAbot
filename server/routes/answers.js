import express from "express";
import fs from "node:fs/promises";

const router = express.Router();

export async function loadAnswers() {
  try {
    const data = await fs.readFile("./data/answers.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Kunne ikke læse svarregler", { cause: error });
  }
}

export async function saveAnswers(answers) {
  const json = JSON.stringify(answers, null, 2);
  await fs.writeFile("./data/answers.json", json);
}

export async function findBestAnswer(question) {
  const answers = await loadAnswers();
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";
  let bestCategory = "";

  for (const answerGroup of answers) {
    const score = countMatches(answerGroup.keywords, normalizedQuestion);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answerGroup.answer;
      bestCategory = answerGroup.category;
    }
  }

  return {
    answer: bestAnswer,
    category: bestCategory
  };
}

function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) =>
    normalizedQuestion.includes(keyword)
  );

  return matches.length;
}

router.get("/", async (request, response) => {
  const answers = await loadAnswers();

  response.json(answers);
});

router.get("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Svarreglen findes ikke." });
    return;
  }

  response.json(answerRule);
});

router.post("/", async (request, response) => {
  const { category, keywords, answer } = request.body;

  if (!category || !Array.isArray(keywords) || keywords.length === 0 || !answer) {
    response.status(400).json({ error: "category, keywords (en liste) og answer er påkrævet." });
    return;
  }

  const answers = await loadAnswers();
  const newAnswerRule = { category, keywords, answer };

  answers.push(newAnswerRule);
  await saveAnswers(answers);

  response.status(201).json(newAnswerRule);
});

router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Svarreglen findes ikke." });
    return;
  }

  const { keywords, answer } = request.body;

  if (!Array.isArray(keywords) || keywords.length === 0 || !answer) {
    response.status(400).json({ error: "keywords (en liste) og answer er påkrævet." });
    return;
  }

  answerRule.keywords = keywords;
  answerRule.answer = answer;
  await saveAnswers(answers);

  response.json(answerRule);
});

router.delete("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Svarreglen findes ikke." });
    return;
  }

  const updatedAnswers = answers.filter((a) => a.category !== request.params.category);

  await saveAnswers(updatedAnswers);

  response.status(204).send();
});

export default router;