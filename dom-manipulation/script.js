document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const categoryFilter = document.getElementById("categoryFilter");

  // Quotes database
  let quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      category: "inspiration",
      author: "Steve Jobs",
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      category: "life",
      author: "John Lennon",
    },
    {
      text: "Knowing yourself is the beginning of all wisdom.",
      category: "wisdom",
      author: "Aristotle",
    },
  ];

  // Initialize the application
  function init() {
    // Create and show the add quote form
    createAddQuoteForm();

    // Set up event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    categoryFilter.addEventListener("change", showRandomQuote);

    // Initialize categories dropdown
    updateCategoryFilter();

    // Show initial quote
    showRandomQuote();
  }

  // Display a random quote (required function)
  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    let filteredQuotes = quotes;

    if (selectedCategory !== "all") {
      filteredQuotes = quotes.filter(
        (quote) => quote.category === selectedCategory
      );
    }

    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes available in this category.</p>";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    const quoteHTML = `
            <div class="quote-category">${quote.category}</div>
            <p class="quote-text">"${quote.text}"</p>
            <p class="quote-author">— ${quote.author}</p>
        `;

    quoteDisplay.innerHTML = quoteHTML;
  }

  // Create the add quote form (required function)
  function createAddQuoteForm() {
    const formHTML = `
            <div id="addQuoteForm" class="add-form">
                <h3>Add New Quote</h3>
                <textarea id="newQuoteText" placeholder="Enter quote text" required></textarea>
                <input type="text" id="newQuoteCategory" placeholder="Enter category" required>
                <div class="form-actions">
                    <button id="addQuote">Add Quote</button>
                </div>
            </div>
        `;

    // Insert the form after the quote display
    quoteDisplay.insertAdjacentHTML("afterend", formHTML);

    // Set up event listener for the add button
    document.getElementById("addQuote").addEventListener("click", function () {
      const text = document.getElementById("newQuoteText").value.trim();
      const category = document
        .getElementById("newQuoteCategory")
        .value.trim()
        .toLowerCase();

      if (!text || !category) {
        alert("Please enter both quote text and category");
        return;
      }

      // Add new quote
      quotes.push({
        text: text,
        category: category,
        author: "Anonymous",
      });

      // Clear form
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";

      // Update UI
      updateCategoryFilter();
      showRandomQuote();
    });
  }

  // Update the category filter dropdown
  function updateCategoryFilter() {
    // Get all unique categories
    const categories = ["all"];
    quotes.forEach((quote) => {
      if (!categories.includes(quote.category)) {
        categories.push(quote.category);
      }
    });

    // Update dropdown
    categoryFilter.innerHTML = categories
      .map(
        (cat) =>
          `<option value="${cat}">${
            cat.charAt(0).toUpperCase() + cat.slice(1)
          }</option>`
      )
      .join("");
  }

  // Start the application
  init();
});
