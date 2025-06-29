let quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Two things are infinite: the universe and human stupidity.", category: "Humor" },
  { text: "So many books, so little time.", category: "Books" }
];

// Display a random quote
function showRandomQuote() {
  const category = document.getElementById('categorySelect').value;
  const filteredQuotes = category
    ? quotes.filter(q => q.category.toLowerCase() === category.toLowerCase())
    : quotes;
  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById('quoteDisplay').innerText = quote ? quote.text : "No quotes available.";
}

// Populate categories into dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const select = document.getElementById('categorySelect');
  select.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.innerText = cat;
    select.appendChild(option);
  });
}

// Add new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (text && category) {
    quotes.push({ text, category });
    populateCategories();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added!');
  } else {
    alert('Please enter both quote and category.');
  }
}

// Event Listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Initial population
window.onload = populateCategories;
