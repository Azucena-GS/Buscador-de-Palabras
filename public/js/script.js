const form = document.querySelector("#search-form");
const sourceText = document.querySelector("#source-text");
const searchTerm = document.querySelector("#search-term");
const alertBox = document.querySelector("#alert");
const results = document.querySelector("#results");
const processedText = document.querySelector("#processed-text");
const countLabel = document.querySelector("#count");
const clearButton = document.querySelector("#clear-button");

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function showAlert(message) {
  alertBox.textContent = message;
  alertBox.hidden = false;
  results.hidden = true;
}

function clearAlert() {
  alertBox.textContent = "";
  alertBox.hidden = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearAlert();

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

  const matcher = new RegExp(escapeRegExp(term), "giu");
  let occurrences = 0;
  let lastIndex = 0;
  let highlightedText = "";

  for (const match of text.matchAll(matcher)) {
    const index = match.index;
    highlightedText += escapeHtml(text.slice(lastIndex, index));
    highlightedText += `<mark>${escapeHtml(match[0])}</mark>`;
    lastIndex = index + match[0].length;
    occurrences += 1;
  }

  highlightedText += escapeHtml(text.slice(lastIndex));
  processedText.innerHTML = highlightedText;
  countLabel.textContent = `${occurrences} ${occurrences === 1 ? "coincidencia" : "coincidencias"}`;
  results.hidden = false;

  if (occurrences === 0) {
    showAlert("No se encontraron coincidencias para la búsqueda indicada.");
    results.hidden = false;
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
