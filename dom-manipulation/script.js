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
  let quotes = [];
  let currentFilter = "all";

  // Initialize the application
  function init() {
    // Load quotes from localStorage
    loadQuotes();

    // Load last filter from localStorage
    loadLastFilter();

    // Set up event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    showAddFormBtn.addEventListener("click", showAddQuoteForm);
    addQuoteBtn.addEventListener("click", addQuote);
    cancelAddBtn.addEventListener("click", hideAddQuoteForm);
    categoryFilter.addEventListener("change", filterQuotes);

    // Initialize categories dropdown
    populateCategories();

    // Show initial quote
    showRandomQuote();
  }

  // Load quotes from localStorage
  function loadQuotes() {
    const savedQuotes = localStorage.getItem("quotes");
    if (savedQuotes) {
      quotes = JSON.parse(savedQuotes);
    } else {
      // Default quotes if none are saved
      quotes = [
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
      saveQuotes();
    }
  }

  // Load last filter from localStorage
  function loadLastFilter() {
    const savedFilter = localStorage.getItem("lastFilter");
    if (savedFilter) {
      currentFilter = savedFilter;
      categoryFilter.value = currentFilter;
    }
  }

  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Save filter to localStorage
  function saveFilter(filter) {
    localStorage.setItem("lastFilter", filter);
  }

  // Populate categories dropdown (required function)
  function populateCategories() {
    // Clear existing options except "All Categories"
    while (categoryFilter.options.length > 1) {
      categoryFilter.remove(1);
    }

    // Get all unique categories from quotes
    const categories = [];
    quotes.forEach((quote) => {
      if (!categories.includes(quote.category)) {
        categories.push(quote.category);
      }
    });

    // Add categories to dropdown
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categoryFilter.appendChild(option);
    });

    // Set to last selected filter
    if (currentFilter && currentFilter !== "all") {
      categoryFilter.value = currentFilter;
    }
  }

  // Filter quotes based on selected category (required function)
  function filterQuotes() {
    currentFilter = categoryFilter.value;
    saveFilter(currentFilter);
    showRandomQuote();
  }

  // Display a random quote from filtered list
  function showRandomQuote() {
    let filteredQuotes = quotes;

    if (currentFilter && currentFilter !== "all") {
      filteredQuotes = quotes.filter(
        (quote) => quote.category === currentFilter
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

    // Store last viewed quote in sessionStorage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
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

    // Save to localStorage
    saveQuotes();

    // Update categories if new category was added
    const categoryExists = Array.from(categoryFilter.options).some(
      (option) => option.value === category
    );

    if (!categoryExists) {
      populateCategories();
    }

    // Update UI
    hideAddQuoteForm();
    showRandomQuote();
  }

  // Start the application
  init();
});
