let quotes = [];

// Simulated server API endpoint
const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';

// DOM Elements
const syncStatus = document.getElementById('syncStatus');

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
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

// Show a random quote (filtered)
function showRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    display.innerHTML = `<p>No quotes in this category.</p>`;
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  display.innerHTML = `<p><strong>${random.category}:</strong> ${random.text}</p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(random));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    alert("New quote added!");
  } else {
    alert("Please fill in both fields.");
  }

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Create input form dynamically
function createAddQuoteForm() {
  const form = document.createElement('div');

  form.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;

  document.body.appendChild(form);
}

// Export quotes to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'quotes.json';
  link.click();
}

// Import quotes from JSON
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
        alert("Invalid file format.");
      }
    } catch {
      alert("Error parsing the file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Setup JSON buttons
function setupJsonButtons() {
  document.getElementById('exportBtn')?.addEventListener('click', exportToJsonFile);
  document.getElementById('importFile')?.addEventListener('change', importFromJsonFile);
}

// Populate categories into dropdown
function populateCategories() {
  const dropdown = document.getElementById('categoryFilter');
  const current = localStorage.getItem('lastFilter') || "all";

  dropdown.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  dropdown.value = current;
}

// Handle filter change
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', selected);
  showRandomQuote();
}

// Simulate server sync
function simulateServerSync() {
  fetch(MOCK_API_URL)
    .then(res => res.json())
    .then(data => {
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
        showNotification(`✔ Synced ${newCount} new quote(s) from server.`);
      } else {
        showNotification("✔ Already up to date.");
      }
    })
    .catch(() => {
      showNotification("⚠ Failed to sync with server.", true);
    });
}

// Merge quotes and remove duplicates
function mergeQuotes(server, local) {
  const existing = new Set(local.map(q => q.text));
  const newOnes = server.filter(q => !existing.has(q.text));
  return [...local, ...newOnes];
}

// Show sync status
function showNotification(msg, isError = false) {
  if (!syncStatus) return;
  syncStatus.textContent = msg;
  syncStatus.style.color = isError ? 'red' : 'green';
  setTimeout(() => (syncStatus.textContent = ''), 5000);
}

// Initialization
window.onload = () => {
  loadQuotes();
  createAddQuoteForm();
  setupJsonButtons();
  populateCategories();

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

  simulateServerSync(); // Initial sync
  setInterval(simulateServerSync, 30000); // Repeat every 30 seconds
};
