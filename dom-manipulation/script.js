const quotes = [
  { text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
  { text: "Success doesn’t just find you. You have to go out and get it.", category: "Success" },
  { text: "The harder you work for something, the greater you’ll feel when you achieve it.", category: "Inspiration" }
];

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const random = Math.floor(Math.random() * quotes.length);
  const quote = quotes[random];
  quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> ${quote.text}</p>`;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    quotes.push({ text, category });
    alert("Quote added successfully!");
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please enter both a quote and a category.");
  }
}
