const quotes = [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Success is not for the lazy.", category: "Success" },
  { text: "Stay positive, work hard, make it happen.", category: "Inspiration" },
];

// Show a random quote
function showRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  display.innerHTML = `<p><strong>${quote.category}:</strong> ${quote.text}</p>`;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Add new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    textInput.value = '';
    categoryInput.value = '';
    alert("New quote added!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Create the Add Quote Form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.type = 'text';
  textInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Call on page load
createAddQuoteForm();
