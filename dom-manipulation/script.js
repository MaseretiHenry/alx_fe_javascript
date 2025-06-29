let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit is your mind.", category: "Motivation" },
      { text: "Success is not for the lazy.", category: "Success" },
      { text: "Stay positive, work hard, make it happen.", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    display.innerHTML = `<p>No quotes in this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  display.innerHTML = `<p><strong>${quote.category}:</strong> ${quote.text}</p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    populateCategories(); // update filter list
    textInput.value = '';
    categoryInput.value = '';
    alert("New quote added!");
  } else {
    alert("Please fill in both fields.");
  }
}

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

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function setupJsonButtons() {
  const exportBtn = document.getElementById('exportBtn');
  const importInput = document.getElementById('importFile');

  if (exportBtn) {
    exportBtn.addEventListener('click', exportToJsonFile);
  }

  if (importInput) {
    importInput.addEventListener('change', importFromJsonFile);
  }
}

// Extract unique categories and populate dropdown
function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  const current = filter.value;

  // Clear all except 'All'
  filter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });

  // Restore last selection
  const lastFilter = localStorage.getItem('lastFilter') || current;
  filter.value = lastFilter;
}

// Filter quotes on dropdown change
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', selected);
  showRandomQuote();
}

window.onload = () => {
  loadQuotes();
  createAddQuoteForm();
  setupJsonButtons();
  populateCategories();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
};

