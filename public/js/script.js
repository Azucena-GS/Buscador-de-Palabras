// Conectamos las variables con los elementos del HTML.
const form = document.querySelector("#search-form");
const sourceText = document.querySelector("#source-text");
const searchTerm = document.querySelector("#search-term");
const replacementText = document.querySelector("#replacement-text");
const alertBox = document.querySelector("#alert");
const results = document.querySelector("#results");
const processedText = document.querySelector("#processed-text");
const countLabel = document.querySelector("#count");
const clearButton = document.querySelector("#clear-button");
const replaceButton = document.querySelector("#replace-button");

// Muestra un mensaje de error o de éxito.
function showAlert(message, isSuccess) {
  alertBox.textContent = message;
  alertBox.hidden = false;

  if (isSuccess) {
    alertBox.classList.add("success");
  } else {
    alertBox.classList.remove("success");
  }
}

// Borra el mensaje que se estaba mostrando.
function clearAlert() {
  alertBox.textContent = "";
  alertBox.hidden = true;
  alertBox.classList.remove("success");
}

// Busca coincidencias y muestra el texto con las palabras en negrita.
function processText(isReplacing) {
  clearAlert();
  results.hidden = true;

  const originalText = sourceText.value;
  const wordToFind = searchTerm.value;
  let newWord = wordToFind;

  if (isReplacing) {
    newWord = replacementText.value;
  }

  // Revisamos que los campos obligatorios tengan contenido.
  if (originalText.trim() === "") {
    showAlert("Escribe o pega un texto antes de continuar.", false);
    sourceText.focus();
    return;
  }

  if (wordToFind.trim() === "") {
    showAlert("Escribe el texto que quieres buscar o reemplazar.", false);
    searchTerm.focus();
    return;
  }

  const textInLowerCase = originalText.toLowerCase();
  const wordInLowerCase = wordToFind.toLowerCase();
  let currentPosition = textInLowerCase.indexOf(wordInLowerCase);
  let lastPosition = 0;
  let numberOfMatches = 0;
  let updatedText = "";

  processedText.textContent = "";

  // Recorremos el texto para encontrar cada coincidencia.
  while (currentPosition !== -1) {
    const textBeforeMatch = originalText.slice(lastPosition, currentPosition);
    let textToShow = originalText.slice(
      currentPosition,
      currentPosition + wordToFind.length
    );

    if (isReplacing) {
      textToShow = newWord;
    }

    // Agregamos el texto anterior y luego resaltamos la coincidencia.
    processedText.append(document.createTextNode(textBeforeMatch));

    const boldText = document.createElement("strong");
    boldText.textContent = textToShow;
    processedText.append(boldText);

    updatedText = updatedText + textBeforeMatch + textToShow;
    lastPosition = currentPosition + wordToFind.length;
    numberOfMatches = numberOfMatches + 1;
    currentPosition = textInLowerCase.indexOf(wordInLowerCase, lastPosition);
  }

  // Agregamos la parte que viene después de la última coincidencia.
  const textAfterMatches = originalText.slice(lastPosition);
  processedText.append(document.createTextNode(textAfterMatches));
  updatedText = updatedText + textAfterMatches;
  results.hidden = false;

  if (numberOfMatches === 1) {
    if (isReplacing) {
      countLabel.textContent = "1 reemplazo";
    } else {
      countLabel.textContent = "1 coincidencia";
    }
  } else if (isReplacing) {
    countLabel.textContent = numberOfMatches + " reemplazos";
  } else {
    countLabel.textContent = numberOfMatches + " coincidencias";
  }

  // Si no encontramos nada, avisamos sin cambiar el texto original.
  if (numberOfMatches === 0) {
    if (isReplacing) {
      showAlert("No se encontró el texto indicado para reemplazar.", false);
    } else {
      showAlert("No se encontraron coincidencias para la búsqueda indicada.", false);
    }
    return;
  }

  // Guardamos los cambios en el campo del texto original.
  if (isReplacing) {
    sourceText.value = updatedText;
    showAlert("Reemplazo realizado. El texto nuevo aparece en negrita.", true);
  }
}

// Al enviar el formulario, buscamos las coincidencias.
form.addEventListener("submit", function (event) {
  event.preventDefault();
  processText(false);
});

// Al presionar el botón, reemplazamos las coincidencias.
replaceButton.addEventListener("click", function () {
  processText(true);
});

// El botón Limpiar borra los campos y los resultados.
clearButton.addEventListener("click", function () {
  form.reset();
  processedText.textContent = "";
  countLabel.textContent = "";
  results.hidden = true;
  clearAlert();
  sourceText.focus();
});
