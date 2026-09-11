import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const messages = [];

const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Frederik. Hvad vil du ellers vide om mig?"
  },
  {
    category: "bosted",
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Viby."
  },
  {
    category: "fritid",
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "I min fritid kan jeg godt lide at game og se serier."
  }
];

function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) =>
    normalizedQuestion.includes(keyword)
  );

  return matches.length;
}

function findBestAnswer(question) {
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

const topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};

app.get("/", (request, response) => {
  response.render("index", { messages, error: "", topicStats });
});

app.post("/ask", (request, response) => {
  const question = request.body.question.trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question });

    const result = findBestAnswer(question);
    messages.push({ type: "answer", text: result.answer });

    if (result.category) {
      topicStats[result.category] = topicStats[result.category] + 1;
    }
  }

  response.render("index", { messages, error, topicStats });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});