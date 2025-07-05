document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const container = document.querySelector(".container");

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
    // Create category filter dropdown
    createCategoryFilter();

    // Create and show the add quote form
    createAddQuoteForm();

    // Set up event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);

    // Show initial quote
    showRandomQuote();
  }

  // Display a random quote
  function showRandomQuote() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter ? categoryFilter.value : "all";

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

    // Clear previous quote
    while (quoteDisplay.firstChild) {
      quoteDisplay.removeChild(quoteDisplay.firstChild);
    }

    // Create new quote elements
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "quote-category";
    categoryDiv.textContent = quote.category;

    const textPara = document.createElement("p");
    textPara.className = "quote-text";
    textPara.textContent = `"${quote.text}"`;

    const authorPara = document.createElement("p");
    authorPara.className = "quote-author";
    authorPara.textContent = `— ${quote.author}`;

    // Append elements to display
    quoteDisplay.appendChild(categoryDiv);
    quoteDisplay.appendChild(textPara);
    quoteDisplay.appendChild(authorPara);
  }

  // Create the add quote form
  function createAddQuoteForm() {
    // Create form container
    const formDiv = document.createElement("div");
    formDiv.id = "addQuoteForm";
    formDiv.className = "add-form";

    // Create form elements
    const heading = document.createElement("h3");
    heading.textContent = "Add New Quote";

    const textArea = document.createElement("textarea");
    textArea.id = "newQuoteText";
    textArea.placeholder = "Enter quote text";
    textArea.required = true;

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter category";
    categoryInput.required = true;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "form-actions";

    const addButton = document.createElement("button");
    addButton.id = "addQuote";
    addButton.textContent = "Add Quote";

    // Build form structure
    actionsDiv.appendChild(addButton);

    formDiv.appendChild(heading);
    formDiv.appendChild(textArea);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(actionsDiv);

    // Insert form into DOM
    container.appendChild(formDiv);

    // Add event listener
    addButton.addEventListener("click", function () {
      const text = textArea.value.trim();
      const category = categoryInput.value.trim().toLowerCase();

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
      textArea.value = "";
      categoryInput.value = "";

      // Update UI
      updateCategoryFilter();
      showRandomQuote();
    });
  }

  // Create category filter dropdown
  function createCategoryFilter() {
    const controlsDiv = document.querySelector(".controls");

    // Create select element
    const select = document.createElement("select");
    select.id = "categoryFilter";

    // Create default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "all";
    defaultOption.textContent = "All Categories";
    select.appendChild(defaultOption);

    // Add category options
    const categories = ["inspiration", "life", "wisdom"]; // Initial categories
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      select.appendChild(option);
    });

    // Add event listener
    select.addEventListener("change", showRandomQuote);

    // Insert at beginning of controls
    controlsDiv.insertBefore(select, controlsDiv.firstChild);
  }

  // Update the category filter dropdown
  function updateCategoryFilter() {
    const select = document.getElementById("categoryFilter");
    if (!select) return;

    // Get current selection
    const currentSelection = select.value;

    // Clear existing options (keep first 'all' option)
    while (select.options.length > 1) {
      select.remove(1);
    }

    // Get all unique categories
    const categories = [];
    quotes.forEach((quote) => {
      if (!categories.includes(quote.category)) {
        categories.push(quote.category);
      }
    });

    // Add category options
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      select.appendChild(option);
    });

    // Restore selection if still available
    if (categories.includes(currentSelection)) {
      select.value = currentSelection;
    }
  }

  // Start the application
  init();
});
