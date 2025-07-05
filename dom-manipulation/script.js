document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const quoteDisplay = document.getElementById("quote-display");
  const categorySelect = document.getElementById("category-select");
  const newQuoteBtn = document.getElementById("new-quote-btn");
  const addQuoteBtn = document.getElementById("add-quote-btn");
  const newCategoryBtn = document.getElementById("new-category-btn");
  const addQuoteForm = document.getElementById("add-quote-form");
  const addCategoryForm = document.getElementById("add-category-form");
  const newQuoteCategory = document.getElementById("new-quote-category");
  const newQuoteText = document.getElementById("new-quote-text");
  const newQuoteAuthor = document.getElementById("new-quote-author");
  const saveQuoteBtn = document.getElementById("save-quote-btn");
  const cancelQuoteBtn = document.getElementById("cancel-quote-btn");
  const newCategoryName = document.getElementById("new-category-name");
  const saveCategoryBtn = document.getElementById("save-category-btn");
  const cancelCategoryBtn = document.getElementById("cancel-category-btn");

  // Initial quotes data structure
  let quotesData = {
    Inspiration: [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },
      {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon",
      },
    ],
    Wisdom: [
      {
        text: "Knowing yourself is the beginning of all wisdom.",
        author: "Aristotle",
      },
      {
        text: "The only true wisdom is in knowing you know nothing.",
        author: "Socrates",
      },
    ],
    Motivation: [
      {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
      },
      {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela",
      },
    ],
  };

  // Initialize the application
  function init() {
    populateCategorySelect();
    populateNewQuoteCategorySelect();
    displayRandomQuote();

    // Set up event listeners
    newQuoteBtn.addEventListener("click", displayRandomQuote);
    addQuoteBtn.addEventListener("click", showAddQuoteForm);
    newCategoryBtn.addEventListener("click", showAddCategoryForm);
    saveQuoteBtn.addEventListener("click", saveNewQuote);
    cancelQuoteBtn.addEventListener("click", hideAddQuoteForm);
    saveCategoryBtn.addEventListener("click", saveNewCategory);
    cancelCategoryBtn.addEventListener("click", hideAddCategoryForm);
    categorySelect.addEventListener("change", displayRandomQuoteFromCategory);
  }

  // Populate the category select dropdown
  function populateCategorySelect() {
    // Clear existing options
    categorySelect.innerHTML = "";

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Categories";
    defaultOption.selected = true;
    categorySelect.appendChild(defaultOption);

    // Add all categories
    Object.keys(quotesData).forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  // Populate the new quote category select dropdown
  function populateNewQuoteCategorySelect() {
    // Clear existing options
    newQuoteCategory.innerHTML = "";

    // Add all categories
    Object.keys(quotesData).forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      newQuoteCategory.appendChild(option);
    });
  }

  // Display a random quote from all categories
  function displayRandomQuote() {
    // Get all quotes from all categories
    const allQuotes = [];
    Object.values(quotesData).forEach((categoryQuotes) => {
      allQuotes.push(...categoryQuotes);
    });

    if (allQuotes.length === 0) {
      quoteDisplay.innerHTML =
        "<p>No quotes available. Please add some quotes.</p>";
      return;
    }

    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    displayQuote(allQuotes[randomIndex]);
  }

  // Display a random quote from the selected category
  function displayRandomQuoteFromCategory() {
    const selectedCategory = categorySelect.value;

    if (!selectedCategory) {
      displayRandomQuote();
      return;
    }

    const categoryQuotes = quotesData[selectedCategory];

    if (!categoryQuotes || categoryQuotes.length === 0) {
      quoteDisplay.innerHTML = `<p>No quotes available in the ${selectedCategory} category.</p>`;
      return;
    }

    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    displayQuote(categoryQuotes[randomIndex], selectedCategory);
  }

  // Display a specific quote with optional category
  function displayQuote(quote, category = null) {
    // Remove fade-in class if it exists
    quoteDisplay.classList.remove("fade-in");

    // Force reflow to restart animation
    void quoteDisplay.offsetWidth;

    // Create the quote HTML
    let quoteHTML = "";
    if (category) {
      quoteHTML += `<div class="quote-category">${category}</div>`;
    }
    quoteHTML += `
            <p class="quote-text">"${quote.text}"</p>
            <p class="quote-author">— ${quote.author}</p>
        `;

    quoteDisplay.innerHTML = quoteHTML;

    // Add fade-in animation
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
    newQuoteAuthor.value = "";
  }

  // Show the add category form
  function showAddCategoryForm() {
    addCategoryForm.classList.remove("hidden");
    newCategoryName.focus();
  }

  // Hide the add category form
  function hideAddCategoryForm() {
    addCategoryForm.classList.add("hidden");
    newCategoryName.value = "";
  }

  // Save a new quote
  function saveNewQuote() {
    const category = newQuoteCategory.value;
    const text = newQuoteText.value.trim();
    const author = newQuoteAuthor.value.trim();

    if (!text || !author) {
      alert("Please enter both the quote text and author.");
      return;
    }

    // Create the new quote object
    const newQuote = { text, author };

    // Add to the quotes data
    if (!quotesData[category]) {
      quotesData[category] = [];
    }
    quotesData[category].push(newQuote);

    // Update the UI
    hideAddQuoteForm();
    displayRandomQuote();

    // If this is a new category, update the select dropdowns
    if (!categorySelect.querySelector(`option[value="${category}"]`)) {
      populateCategorySelect();
      populateNewQuoteCategorySelect();
    }
  }

  // Save a new category
  function saveNewCategory() {
    const categoryName = newCategoryName.value.trim();

    if (!categoryName) {
      alert("Please enter a category name.");
      return;
    }

    // Check if category already exists
    if (quotesData[categoryName]) {
      alert("This category already exists.");
      return;
    }

    // Add the new category
    quotesData[categoryName] = [];

    // Update the UI
    hideAddCategoryForm();
    populateCategorySelect();
    populateNewQuoteCategorySelect();

    // Select the new category
    categorySelect.value = categoryName;
    displayRandomQuoteFromCategory();
  }

  // Initialize the application
  init();
});
