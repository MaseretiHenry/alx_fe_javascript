let quotes = [];

const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
const MOCK_POST_API = 'https://jsonplaceholder.typicode.com/posts';
const syncStatus = document.getElementById('syncStatus');

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The only limit is your mind.", category: "Motivation" },
      { text: "Success is not for the lazy.", category: "Success" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const selected = document.getElementById('categoryFilter').value;
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    display.innerHTML = `<p>No quotes in this category.</p>`;
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  display.innerHTML = `<p><strong>${random.category}:</strong> ${random.text}</p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(random));
}

// Add quote from form
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToServer(newQuote);
    alert("New quote added!");
  } else {
    alert("Please fill in both fields.");
  }

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Create Add Quote Form
function createAddQuoteForm() {
  const form = document.createElement('div');
  form.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(form);
}

// Export quotes
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

// Import quotes
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

function setupJsonButtons() {
  document.getElementById('exportBtn')?.addEventListener('click', exportToJsonFile);
  document.getElementById('importFile')?.addEventListener('change', importFromJsonFile);
}

// Populate categories in dropdown
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const current = localStorage.getItem('lastFilter') || "all";

  select.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  select.value = current;
}

// Filter handler
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', selected);
  showRandomQuote();
}

// ✅ POST new quote to mock server
async function postQuoteToServer(quote) {
  try {
    await fetch(MOCK_POST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    showNotification("✔ Quote posted to server.");
  } catch (error) {
    showNotification("⚠ Failed to post quote to server.", true);
  }
}

// ✅ FETCH from mock server using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(MOCK_API_URL);
    const data = await response.json();

    const serverQuotes = data.map(item => ({
      text: item.title,
      category: 'Server'
    }));

    const merged = mergeQuotes(serverQuotes, quotes);
    const newCount = merged.length - quotes.length;

    if (newCount > 0) {
      quotes = merged;
      saveQuotes();
      populateCategories();
      showNotification("Quotes synced with server!");
    } else {
      showNotification("✔ Already up to date.");
    }
  } catch (error) {
    showNotification("⚠ Failed to fetch from server.", true);
  }
}

// ✅ CONFLICT RESOLUTION + periodic SYNC
async function syncQuotes() {
  await fetchQuotesFromServer();
}

// Merge without duplicates
function mergeQuotes(serverQuotes, localQuotes) {
  const existing = new Set(localQuotes.map(q => q.text));
  const newOnes = serverQuotes.filter(q => !existing.has(q.text));
  return [...localQuotes, ...newOnes];
}

// Show notification message
function showNotification(msg, isError = false) {
  if (!syncStatus) return;
  syncStatus.textContent = msg;
  syncStatus.style.color = isError ? 'red' : 'green';
  setTimeout(() => (syncStatus.textContent = ''), 5000);
}

// Init
window.onload = () => {
  loadQuotes();
  createAddQuoteForm();
  setupJsonButtons();
  populateCategories();

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

  syncQuotes(); // Initial sync
  setInterval(syncQuotes, 30000); // Periodic sync
};
