document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const showAddFormBtn = document.getElementById("showAddForm");
  const addQuoteForm = document.getElementById("addQuoteForm");
  const addQuoteBtn = document.getElementById("addQuote");
  const cancelAddBtn = document.getElementById("cancelAdd");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
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
    {
      text: "The only true wisdom is in knowing you know nothing.",
      category: "wisdom",
      author: "Socrates",
    },
    {
      text: "Believe you can and you're halfway there.",
      category: "motivation",
      author: "Theodore Roosevelt",
    },
  ];

  // Initialize the application
  function init() {
    // Set up event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    showAddFormBtn.addEventListener("click", showAddQuoteForm);
    addQuoteBtn.addEventListener("click", addQuote);
    cancelAddBtn.addEventListener("click", hideAddQuoteForm);
    categoryFilter.addEventListener("change", showRandomQuote);

    // Initialize categories dropdown
    updateCategoryFilter();

    // Show initial quote
    showRandomQuote();
  }

  // Display a random quote
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

    // Create quote HTML
    const quoteHTML = `
            <div class="quote-category">${quote.category}</div>
            <p class="quote-text">"${quote.text}"</p>
            <p class="quote-author">— ${quote.author}</p>
        `;

    // Apply animation
    quoteDisplay.classList.remove("fade-in");
    void quoteDisplay.offsetWidth; // Trigger reflow
    quoteDisplay.innerHTML = quoteHTML;
    quoteDisplay.classList.add("fade-in");
  }

  // Show the add quote form
  function showAddQuoteForm() {
    addQuoteForm.classList.remove("hidden");
    newQuoteText.focus();
  }

  // Hide the add quote form
  function hideAddQuoteForm() {
    addQuoteForm.classList.add("hidden");
    newQuoteText.value = "";
    newQuoteCategory.value = "";
  }

  // Add a new quote
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim().toLowerCase();

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

    // Update UI
    hideAddQuoteForm();
    updateCategoryFilter();
    showRandomQuote();
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
