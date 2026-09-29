const API_URL = "http://localhost:3000";
const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#question-form");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear-messages-button");
const emptyState = document.querySelector("#empty-state");
const formError = document.querySelector(".form-error");

function updateEmptyState() {
  emptyState.hidden = messagesContainer.children.length > 0;
}

function displayMessage(message) {
  const cssClass = message.type === "question" ? "message-user" : "message-bot";

  const html = /*html*/ `
    <div class="message ${cssClass}">
      <p>${message.text}</p>
    </div>`;

  messagesContainer.insertAdjacentHTML("beforeend", html);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  updateEmptyState();
}

async function getMessages() {
  const response = await fetch(`${API_URL}/messages`);
  const messages = await response.json();

  for (const message of messages) {
    displayMessage(message);
  }

  updateEmptyState();
}

getMessages();

questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (!question) return;

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  if (data.error) {
    formError.textContent = data.error;
    return;
  }

  formError.textContent = "";
  displayMessage(data.question);
  displayMessage(data.answer);

  questionInput.value = "";
  questionInput.dispatchEvent(new Event("input"));
});

clearMessagesButton.addEventListener("click", async () => {
  await fetch(`${API_URL}/messages`, { method: "DELETE" });
  messagesContainer.innerHTML = "";
  updateEmptyState();
});