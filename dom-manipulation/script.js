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
  const syncStatus = document.getElementById("sync-status");
  const conflictNotice = document.getElementById("conflict-notice");
  const manualSyncBtn = document.getElementById("manualSync");
  const resolveConflictModal = document.getElementById("resolveConflictModal");
  const keepLocalBtn = document.getElementById("keepLocal");
  const keepServerBtn = document.getElementById("keepServer");
  const mergeChangesBtn = document.getElementById("mergeChanges");

  // Configuration
  const SYNC_INTERVAL = 30000; // 30 seconds
  const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

  // Application state
  let quotes = [];
  let currentFilter = "all";
  let lastSyncTime = null;
  let pendingChanges = false;
  let syncInProgress = false;
  let conflictData = null;

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
    manualSyncBtn.addEventListener("click", manualSync);
    keepLocalBtn.addEventListener("click", () => resolveConflict("local"));
    keepServerBtn.addEventListener("click", () => resolveConflict("server"));
    mergeChangesBtn.addEventListener("click", () => resolveConflict("merge"));

    // Initialize categories dropdown
    populateCategories();

    // Show initial quote
    showRandomQuote();

    // Start periodic sync
    setInterval(syncWithServer, SYNC_INTERVAL);

    // Initial sync
    setTimeout(syncWithServer, 2000);
  }

  // ========================
  // DATA MANAGEMENT FUNCTIONS
  // ========================

  function loadQuotes() {
    const savedQuotes = localStorage.getItem("quotes");
    if (savedQuotes) {
      quotes = JSON.parse(savedQuotes);
    } else {
      // Default quotes if none are saved
      quotes = [
        {
          id: generateId(),
          text: "The only way to do great work is to love what you do.",
          category: "inspiration",
          author: "Steve Jobs",
          version: 1,
        },
        {
          id: generateId(),
          text: "Life is what happens when you're busy making other plans.",
          category: "life",
          author: "John Lennon",
          version: 1,
        },
        {
          id: generateId(),
          text: "Knowing yourself is the beginning of all wisdom.",
          category: "wisdom",
          author: "Aristotle",
          version: 1,
        },
      ];
      saveQuotes();
    }
  }

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    pendingChanges = true;
  }

  function loadLastFilter() {
    const savedFilter = localStorage.getItem("lastFilter");
    if (savedFilter) {
      currentFilter = savedFilter;
      categoryFilter.value = currentFilter;
    }
  }

  function saveFilter(filter) {
    localStorage.setItem("lastFilter", filter);
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // ========================
  // UI FUNCTIONS
  // ========================

  function populateCategories() {
    while (categoryFilter.options.length > 1) {
      categoryFilter.remove(1);
    }

    const categories = [];
    for (let i = 0; i < quotes.length; i++) {
      if (!categories.includes(quotes[i].category)) {
        categories.push(quotes[i].category);
      }
    }

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categoryFilter.appendChild(option);
    }

    if (currentFilter && currentFilter !== "all") {
      categoryFilter.value = currentFilter;
    }
  }

  function showRandomQuote() {
    const filterValue = categoryFilter.value;
    let filteredQuotes = [];

    if (filterValue === "all") {
      filteredQuotes = [...quotes];
    } else {
      for (let i = 0; i < quotes.length; i++) {
        if (quotes[i].category === filterValue) {
          filteredQuotes.push(quotes[i]);
        }
      }
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

    quoteDisplay.classList.remove("fade-in");
    void quoteDisplay.offsetWidth;
    quoteDisplay.innerHTML = quoteHTML;
    quoteDisplay.classList.add("fade-in");

    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
  }

  function filterQuotes() {
    currentFilter = categoryFilter.value;
    saveFilter(currentFilter);
    showRandomQuote();
  }

  function showAddQuoteForm() {
    addQuoteForm.classList.remove("hidden");
    newQuoteText.focus();
  }

  function hideAddQuoteForm() {
    addQuoteForm.classList.add("hidden");
    newQuoteText.value = "";
    newQuoteCategory.value = "";
  }

  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim().toLowerCase();

    if (!text || !category) {
      alert("Please enter both quote text and category");
      return;
    }

    quotes.push({
      id: generateId(),
      text: text,
      category: category,
      author: "Anonymous",
      version: 1,
    });

    saveQuotes();

    const categoryExists = Array.from(categoryFilter.options).some(
      (option) => option.value === category
    );

    if (!categoryExists) {
      populateCategories();
    }

    hideAddQuoteForm();
    showRandomQuote();
  }

  // ========================
  // SERVER SYNC FUNCTIONS (ADD THESE)
  // ========================

  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(`${SERVER_URL}?userId=1`);
      if (!response.ok) {
        throw new Error("Failed to fetch quotes from server");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      updateSyncStatus("Failed to fetch quotes", "error");
      return [];
    }
  }

  async function postQuotesToServer(quotesData) {
    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        body: JSON.stringify(quotesData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to post quotes to server");
      }
      return await response.json();
    } catch (error) {
      console.error("Post error:", error);
      updateSyncStatus("Failed to sync quotes", "error");
      return null;
    }
  }

  async function syncQuotes() {
    if (syncInProgress) return;

    syncInProgress = true;
    updateSyncStatus("Syncing with server...", "syncing");

    try {
      // 1. Fetch latest quotes from server
      const serverQuotes = await fetchQuotesFromServer();

      // 2. Convert server data to our quote format
      const formattedServerQuotes = serverQuotes.map((post) => ({
        id: `server-${post.id}`,
        text: post.title || post.body || "No text available",
        category: "server",
        author: "User " + (post.userId || "Unknown"),
        version: post.id, // Using post id as version for simplicity
      }));

      // 3. Handle conflicts and merge data
      await handleServerResponse(formattedServerQuotes);

      // 4. Update last sync time
      lastSyncTime = new Date();
      updateSyncStatus(
        `Last synced: ${lastSyncTime.toLocaleTimeString()}`,
        "success"
      );
    } catch (error) {
      console.error("Sync error:", error);
      updateSyncStatus("Sync failed: " + error.message, "error");
    } finally {
      syncInProgress = false;
    }
  }

  // Replace the existing syncWithServer with this new version
  async function syncWithServer() {
    // For backward compatibility
    return syncQuotes();
  }

  // Update manualSync to use syncQuotes
  function manualSync() {
    syncQuotes();
  }

  // Update sendQuotesToServer to use postQuotesToServer
  async function sendQuotesToServer() {
    // Convert our quotes to server format
    const serverFormatQuotes = quotes.map((quote) => ({
      title: quote.text,
      body: `Category: ${quote.category}, Author: ${quote.author}`,
      userId: 1, // Mock user ID
    }));

    return postQuotesToServer(serverFormatQuotes);
  }
  // Start the application
  init();
});
