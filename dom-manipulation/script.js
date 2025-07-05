document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");

  // Sample quotes data
  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
    },
    {
      text: "Knowing yourself is the beginning of all wisdom.",
      author: "Aristotle",
    },
    {
      text: "The only true wisdom is in knowing you know nothing.",
      author: "Socrates",
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      text: "It always seems impossible until it's done.",
      author: "Nelson Mandela",
    },
  ];

  // Initialize the application
  function init() {
    // Set up event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    // Display first quote
    showRandomQuote();
  }

  // Display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Create quote HTML
    const quoteHTML = `
            <p class="quote-text">"${quote.text}"</p>
            <p class="quote-author">— ${quote.author}</p>
        `;

    // Update the display
    quoteDisplay.innerHTML = quoteHTML;

    // Add animation class
    quoteDisplay.classList.add("fade-in");

    // Remove animation class after it completes to allow re-triggering
    setTimeout(() => {
      quoteDisplay.classList.remove("fade-in");
    }, 500);
  }

  // Initialize the application
  init();
});
