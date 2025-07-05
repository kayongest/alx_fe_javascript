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
  const exportQuotesBtn = document.getElementById("exportQuotes");
  const importFileInput = document.getElementById("importFile");

  // Quotes database
  let quotes = [];

  // Initialize the application
  function init() {
    // Load quotes from localStorage
    loadQuotes();

    // Set up event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    showAddFormBtn.addEventListener("click", showAddQuoteForm);
    addQuoteBtn.addEventListener("click", addQuote);
    cancelAddBtn.addEventListener("click", hideAddQuoteForm);
    categoryFilter.addEventListener("change", showRandomQuote);
    exportQuotesBtn.addEventListener("click", exportQuotesToJson);
    importFileInput.addEventListener("change", importFromJsonFile);

    // Initialize categories dropdown
    updateCategoryFilter();

    // Show initial quote
    showRandomQuote();

    // Store last viewed time in sessionStorage
    sessionStorage.setItem("lastViewed", new Date().toISOString());
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

  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
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

    // Store last viewed quote in sessionStorage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));

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

    // Save to localStorage
    saveQuotes();

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

  // Export quotes to JSON file using Blob
  function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);

    // Explicitly create a Blob
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const exportFileDefaultName = "quotes.json";

    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.download = exportFileDefaultName;

    // Append to body, click and then remove
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);

    // Release the object URL
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }

  // Import quotes from JSON file
  function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);

        if (!Array.isArray(importedQuotes)) {
          throw new Error("Imported data is not an array");
        }

        // Validate each quote
        const validQuotes = importedQuotes.filter(
          (quote) => quote.text && quote.category
        );

        if (validQuotes.length === 0) {
          throw new Error("No valid quotes found in the file");
        }

        // Add imported quotes
        quotes.push(...validQuotes);
        saveQuotes();
        updateCategoryFilter();
        showRandomQuote();

        alert(`Successfully imported ${validQuotes.length} quotes!`);
      } catch (error) {
        alert("Error importing quotes: " + error.message);
        console.error("Import error:", error);
      }

      // Reset file input
      event.target.value = "";
    };

    fileReader.onerror = function () {
      alert("Error reading file");
      event.target.value = "";
    };

    fileReader.readAsText(file);
  }

  // Start the application
  init();
});
