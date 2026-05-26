// Memory log buffer for initial page load logs
const logHistory = [];
const MAX_HISTORY = 100;

// Connected SSE clients
let clients = [];

function broadcast(logEntry) {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(logEntry)}\n\n`);
  });
}

const logger = {
  log(message, level = "info") {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message };
    
    // Print to server console
    const color = level === "error" ? "\x1b[31m" : level === "warn" ? "\x1b[33m" : level === "success" ? "\x1b[32m" : "\x1b[36m";
    const reset = "\x1b[0m";
    console.log(`${color}[${timestamp}] [${level.toUpperCase()}] ${message}${reset}`);

    // Push to memory buffer
    logHistory.push(logEntry);
    if (logHistory.length > MAX_HISTORY) {
      logHistory.shift();
    }

    // Broadcast to listening clients
    broadcast(logEntry);
  },

  // Express middleware to register SSE listeners
  registerClient(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    this.log(`[System Monitor] Terminal monitor linked (Client ID: ${clientId})`, "info");

    // Send history logs first
    logHistory.forEach(log => {
      res.write(`data: ${JSON.stringify(log)}\n\n`);
    });

    req.on("close", () => {
      clients = clients.filter(c => c.id !== clientId);
      this.log(`[System Monitor] Terminal monitor unlinked (Client ID: ${clientId})`, "info");
    });
  },

  getHistory() {
    return logHistory;
  }
};

module.exports = logger;
