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
  // SERVER SYNC FUNCTIONS
  // ========================

  function manualSync() {
    syncWithServer();
  }

  async function syncWithServer() {
    if (syncInProgress) {
      updateSyncStatus("Syncing already in progress", "syncing");
      return;
    }

    syncInProgress = true;
    updateSyncStatus("Syncing with server...", "syncing");

    try {
      // Simulate fetching from server
      const serverQuotes = await fetchServerQuotes();

      // Check for conflicts and merge changes
      await handleServerResponse(serverQuotes);

      lastSyncTime = new Date();
      pendingChanges = false;
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

  async function fetchServerQuotes() {
    // In a real app, this would be a fetch() call to your actual server
    // For simulation, we'll use localStorage to mock server behavior

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get "server" data from a different localStorage key
    const serverData = localStorage.getItem("serverQuotes");

    if (serverData) {
      return JSON.parse(serverData);
    } else {
      // Initialize server data with some default quotes
      const defaultQuotes = [
        {
          id: "server1",
          text: "Simulated server quote 1",
          category: "server",
          author: "System",
          version: 1,
        },
        {
          id: "server2",
          text: "Simulated server quote 2",
          category: "server",
          author: "System",
          version: 1,
        },
      ];
      localStorage.setItem("serverQuotes", JSON.stringify(defaultQuotes));
      return defaultQuotes;
    }
  }

  async function postQuotesToServer() {
    // Simulate posting to server
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save our quotes as the new server state
    localStorage.setItem("serverQuotes", JSON.stringify(quotes));
    return quotes;
  }

  async function handleServerResponse(serverQuotes) {
    // Check for conflicts
    const conflicts = findConflicts(quotes, serverQuotes);

    if (conflicts.length > 0) {
      // Store conflict data for resolution
      conflictData = {
        serverQuotes: serverQuotes,
        conflicts: conflicts,
      };

      // Show conflict resolution UI
      showConflictNotice(conflicts.length);
      return;
    }

    // No conflicts, proceed with merge
    mergeQuotes(quotes, serverQuotes);
    saveQuotes();

    // Post our updated quotes to server
    await postQuotesToServer();
  }

  function findConflicts(localQuotes, serverQuotes) {
    const conflicts = [];

    // Create a map of server quotes by ID for easy lookup
    const serverQuoteMap = {};
    for (let i = 0; i < serverQuotes.length; i++) {
      serverQuoteMap[serverQuotes[i].id] = serverQuotes[i];
    }

    // Check for conflicts
    for (let i = 0; i < localQuotes.length; i++) {
      const localQuote = localQuotes[i];
      const serverQuote = serverQuoteMap[localQuote.id];

      if (serverQuote && serverQuote.version > localQuote.version) {
        conflicts.push({
          id: localQuote.id,
          local: localQuote,
          server: serverQuote,
        });
      }
    }

    return conflicts;
  }

  function mergeQuotes(localQuotes, serverQuotes) {
    // Create a map of local quotes by ID for easy lookup
    const localQuoteMap = {};
    for (let i = 0; i < localQuotes.length; i++) {
      localQuoteMap[localQuotes[i].id] = localQuotes[i];
    }

    // Start with server quotes as base
    const mergedQuotes = [...serverQuotes];

    // Add any local quotes that don't exist on server
    for (let i = 0; i < localQuotes.length; i++) {
      const localQuote = localQuotes[i];
      if (!localQuoteMap[localQuote.id]) {
        mergedQuotes.push(localQuote);
      }
    }

    // Update the main quotes array
    quotes = mergedQuotes;
  }

  function showConflictNotice(conflictCount) {
    conflictNotice.textContent = `${conflictCount} conflict(s) detected. Click to resolve.`;
    conflictNotice.classList.remove("hidden");

    conflictNotice.addEventListener("click", showConflictModal);
  }

  function hideConflictNotice() {
    conflictNotice.classList.add("hidden");
    conflictNotice.removeEventListener("click", showConflictModal);
  }

  function showConflictModal() {
    resolveConflictModal.classList.remove("hidden");
  }

  function hideConflictModal() {
    resolveConflictModal.classList.add("hidden");
  }

  async function resolveConflict(resolution) {
    hideConflictModal();
    hideConflictNotice();

    updateSyncStatus("Resolving conflicts...", "syncing");

    try {
      if (resolution === "local") {
        // Keep local changes - overwrite server with our version
        await postQuotesToServer();
      } else if (resolution === "server") {
        // Accept server version - overwrite local with server version
        quotes = [...conflictData.serverQuotes];
        saveQuotes();
      } else if (resolution === "merge") {
        // Merge changes intelligently
        mergeQuotes(quotes, conflictData.serverQuotes);
        saveQuotes();
        await postQuotesToServer();
      }

      updateSyncStatus("Conflicts resolved", "success");
      showRandomQuote();
    } catch (error) {
      console.error("Conflict resolution error:", error);
      updateSyncStatus("Conflict resolution failed", "error");
    }

    conflictData = null;
  }

  function updateSyncStatus(message, status) {
    syncStatus.textContent = message;
    syncStatus.className = "sync-status";

    if (status) {
      syncStatus.classList.add(status);
    }
  }

  // Start the application
  init();
});
