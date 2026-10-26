const form = document.querySelector("#search-form");
const sourceText = document.querySelector("#source-text");
const searchTerm = document.querySelector("#search-term");
const alertBox = document.querySelector("#alert");
const results = document.querySelector("#results");
const processedText = document.querySelector("#processed-text");
const countLabel = document.querySelector("#count");
const clearButton = document.querySelector("#clear-button");

function showAlert(message) {
  alertBox.textContent = message;
  alertBox.hidden = false;
}

function clearAlert() {
  alertBox.textContent = "";
  alertBox.hidden = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearAlert();
  results.hidden = true;

  const text = sourceText.value;
  const term = searchTerm.value;

  if (!text.trim()) {
    showAlert("Escribe o pega un texto antes de iniciar la búsqueda.");
    sourceText.focus();
    return;
  }

  if (!term.trim()) {
    showAlert("Escribe una palabra o carácter para buscar.");
    searchTerm.focus();
    return;
  }

  const lowerCaseText = text.toLowerCase();
  const lowerCaseTerm = term.toLowerCase();
  let occurrences = 0;
  let lastPosition = 0;
  let position = lowerCaseText.indexOf(lowerCaseTerm);

  processedText.textContent = "";

  while (position !== -1) {
    processedText.append(document.createTextNode(text.slice(lastPosition, position)));

    const boldWord = document.createElement("strong");
    boldWord.textContent = text.slice(position, position + term.length);
    processedText.append(boldWord);

    lastPosition = position + term.length;
    occurrences += 1;
    position = lowerCaseText.indexOf(lowerCaseTerm, lastPosition);
  }

  processedText.append(document.createTextNode(text.slice(lastPosition)));
  countLabel.textContent = `${occurrences} ${occurrences === 1 ? "coincidencia" : "coincidencias"}`;
  results.hidden = false;

  if (occurrences === 0) {
    showAlert("No se encontraron coincidencias para la búsqueda indicada.");
  }
});

clearButton.addEventListener("click", () => {
  form.reset();
  processedText.textContent = "";
  countLabel.textContent = "";
  results.hidden = true;
  clearAlert();
  sourceText.focus();
});
