const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const logger = require("./logger");

const JSON_DB_PATH = path.join(__dirname, "database.json");
let isMongo = false;

// Default Seed Data
const DEFAULT_EXPENSES = [
  { id: "exp-1", description: "Monthly Apartment Rent", amount: 8000, category: "Rent", type: "Expense", date: new Date().toLocaleDateString() },
  { id: "exp-2", description: "Software Developer Salary", amount: 25000, category: "Salary", type: "Income", date: new Date().toLocaleDateString() },
  { id: "exp-3", description: "Starbucks Coffee & Snacks", amount: 450, category: "Food", type: "Expense", date: new Date().toLocaleDateString() },
  { id: "exp-4", description: "Uber office commute", amount: 350, category: "Travel", type: "Expense", date: new Date().toLocaleDateString() }
];

const DEFAULT_BUDGET = 15000;

// Mongoose Schema Definitions
const TransactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true }, // Expense / Income
  date: { type: String, required: true }
}, { timestamps: true });

const BudgetSchema = new mongoose.Schema({
  limit: { type: Number, default: 15000 }
}, { timestamps: true });

let Transaction, Budget;

// Helper: Read Local JSON DB
function readJsonDb() {
  if (!fs.existsSync(JSON_DB_PATH)) {
    const defaultDb = {
      transactions: DEFAULT_EXPENSES,
      budget: DEFAULT_BUDGET
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultDb, null, 2), "utf8");
    return defaultDb;
  }
  try {
    const content = fs.readFileSync(JSON_DB_PATH, "utf8");
    return JSON.parse(content);
  } catch (error) {
    logger.log(`[DB Local Error] Failed to parse local JSON DB. Seeding defaults.`, "error");
    return { transactions: [], budget: DEFAULT_BUDGET };
  }
}

// Helper: Write Local JSON DB
function writeJsonDb(data) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    logger.log(`[DB Local Error] Write failed: ${error.message}`, "error");
  }
}

const db = {
  async init() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      try {
        logger.log(`[DB Setup] Connecting to MongoDB: ${mongoUri}...`, "info");
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 4000
        });
        isMongo = true;
        
        Transaction = mongoose.model("Transaction", TransactionSchema);
        Budget = mongoose.model("Budget", BudgetSchema);
        
        logger.log(`[DB Setup] MongoDB connected successfully.`, "success");
        
        // Seed MongoDB if empty
        const txCount = await Transaction.countDocuments();
        if (txCount === 0) {
          logger.log(`[DB Seeder] Seeding default records into MongoDB collections...`, "info");
          await Transaction.insertMany(DEFAULT_EXPENSES.map(({ id, ...rest }) => rest));
          const newBudget = new Budget({ limit: DEFAULT_BUDGET });
          await newBudget.save();
          logger.log(`[DB Seeder] Seed injection complete.`, "success");
        }
      } catch (err) {
        logger.log(`[DB Warning] MongoDB handshake failed: ${err.message}`, "warn");
        logger.log(`[DB Warning] Falling back to offline JSON File engine.`, "warn");
        isMongo = false;
      }
    } else {
      logger.log(`[DB Setup] MONGODB_URI not provided. Running on local JSON File engine.`, "info");
      isMongo = false;
    }

    if (!isMongo) {
      readJsonDb(); // Ensure local DB exists
      logger.log(`[DB Setup] File-based database online at ${JSON_DB_PATH}`, "success");
    }
  },

  isMongoEngine() {
    return isMongo;
  },

  // RESET
  async reset() {
    if (isMongo) {
      await Transaction.deleteMany({});
      await Budget.deleteMany({});
      
      await Transaction.insertMany(DEFAULT_EXPENSES.map(({ id, ...rest }) => rest));
      const newBudget = new Budget({ limit: DEFAULT_BUDGET });
      await newBudget.save();
      logger.log(`[DB Reset] MongoDB tables flushed & re-seeded.`, "warn");
    } else {
      const freshDb = {
        transactions: DEFAULT_EXPENSES,
        budget: DEFAULT_BUDGET
      };
      writeJsonDb(freshDb);
      logger.log(`[DB Reset] Local JSON database reset to seeds.`, "warn");
    }
  },

  // TRANSACTIONS
  async getTransactions() {
    if (isMongo) {
      const list = await Transaction.find().sort({ createdAt: -1 });
      return list.map(d => ({
        id: d._id.toString(),
        description: d.description,
        amount: d.amount,
        category: d.category,
        type: d.type,
        date: d.date
      }));
    } else {
      return readJsonDb().transactions;
    }
  },

  async addTransaction(data) {
    if (isMongo) {
      const doc = new Transaction({
        description: data.description,
        amount: Number(data.amount),
        category: data.category,
        type: data.type,
        date: data.date
      });
      await doc.save();
      logger.log(`[DB Write] MongoDB transaction created: "${doc.description}" (₹${doc.amount})`, "success");
      return { id: doc._id.toString(), ...data };
    } else {
      const dbData = readJsonDb();
      const newTx = {
        id: `exp-${Date.now()}`,
        description: data.description,
        amount: Number(data.amount),
        category: data.category,
        type: data.type,
        date: data.date
      };
      dbData.transactions.unshift(newTx);
      writeJsonDb(dbData);
      logger.log(`[DB Write] Local JSON transaction created: "${newTx.description}"`, "success");
      return newTx;
    }
  },

  async deleteTransaction(id) {
    if (isMongo) {
      const doc = await Transaction.findByIdAndDelete(id);
      if (!doc) throw new Error("Transaction not found");
      logger.log(`[DB Delete] MongoDB transaction "${doc.description}" removed`, "warn");
      return { id };
    } else {
      const dbData = readJsonDb();
      const desc = dbData.transactions.find(t => t.id === id)?.description || "Unknown";
      dbData.transactions = dbData.transactions.filter(t => t.id !== id);
      writeJsonDb(dbData);
      logger.log(`[DB Delete] Local JSON transaction "${desc}" removed`, "warn");
      return { id };
    }
  },

  // BUDGET
  async getBudget() {
    if (isMongo) {
      const budgetDoc = await Budget.findOne();
      return budgetDoc ? budgetDoc.limit : DEFAULT_BUDGET;
    } else {
      return readJsonDb().budget;
    }
  },

  async updateBudget(limit) {
    if (isMongo) {
      let budgetDoc = await Budget.findOne();
      if (budgetDoc) {
        budgetDoc.limit = Number(limit);
        await budgetDoc.save();
      } else {
        budgetDoc = new Budget({ limit: Number(limit) });
        await budgetDoc.save();
      }
      logger.log(`[DB Update] MongoDB monthly budget updated to ₹${limit}`, "success");
      return budgetDoc.limit;
    } else {
      const dbData = readJsonDb();
      dbData.budget = Number(limit);
      writeJsonDb(dbData);
      logger.log(`[DB Update] Local JSON monthly budget updated to ₹${limit}`, "success");
      return dbData.budget;
    }
  }
};

module.exports = db;
