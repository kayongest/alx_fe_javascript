document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const quoteDisplay = document.getElementById("quote-display");
  const newQuoteBtn = document.getElementById("new-quote-btn");
  const addQuoteBtn = document.getElementById("add-quote-btn");
  const quoteTextInput = document.getElementById("quote-text");
  const quoteAuthorInput = document.getElementById("quote-author");

  // Quotes array
  let quotes = [
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
  ];

  // Initialize the app
  function init() {
    // Set up event listeners
    newQuoteBtn.addEventListener("click", displayRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);

    // Display first quote
    displayRandomQuote();
  }

  // Display a random quote
  function displayRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML =
        "<p>No quotes available. Please add some quotes.</p>";
      return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Create HTML for the quote
    const quoteHTML = `
            <p class="quote-text">"${quote.text}"</p>
            <p class="quote-author">— ${quote.author}</p>
        `;

    // Apply fade animation
    quoteDisplay.classList.remove("fade-in");
    void quoteDisplay.offsetWidth; // Trigger reflow
    quoteDisplay.innerHTML = quoteHTML;
    quoteDisplay.classList.add("fade-in");
  }

  // Add a new quote
  function addQuote() {
    const text = quoteTextInput.value.trim();
    const author = quoteAuthorInput.value.trim();

    if (text && author) {
      // Add new quote to array
      quotes.push({ text, author });

      // Clear inputs
      quoteTextInput.value = "";
      quoteAuthorInput.value = "";

      // Display the new quote
      displayRandomQuote();
    } else {
      alert("Please enter both quote text and author");
    }
  }

  // Start the application
  init();
});
