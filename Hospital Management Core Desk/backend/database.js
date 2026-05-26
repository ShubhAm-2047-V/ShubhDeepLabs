const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const logger = require("./logger");

const JSON_DB_PATH = path.join(__dirname, "database.json");
let isMongo = false;

// Default Seed Data
const DEFAULT_APPOINTMENTS = [
  { id: "apt-1", patientName: "Aman Verma", doctorName: "Dr. Mehta (Cardio)", date: new Date().toLocaleDateString(), slot: "10:30 AM", status: "Scheduled", reason: "General heart checkup" },
  { id: "apt-2", patientName: "Pooja Patel", doctorName: "Dr. Sharma (Ortho)", date: new Date().toLocaleDateString(), slot: "11:45 AM", status: "Completed", reason: "Post-fracture consultation" },
  { id: "apt-3", patientName: "Rahul Sen", doctorName: "Dr. Joshi (Pedia)", date: new Date().toLocaleDateString(), slot: "02:15 PM", status: "Scheduled", reason: "Seasonal flu review" }
];

const DEFAULT_INVOICES = [
  { id: "inv-1", patientName: "Aman Verma", treatmentFee: 1200, consultFee: 500, medFee: 350, total: 2050, status: "Paid", date: new Date().toLocaleDateString() },
  { id: "inv-2", patientName: "Pooja Patel", treatmentFee: 800, consultFee: 500, medFee: 200, total: 1500, status: "Unpaid", date: new Date().toLocaleDateString() }
];

const DEFAULT_PRESCRIPTIONS = [
  { id: "rx-1", patientName: "Pooja Patel", diagnosis: "Ankle Sprain Recovery", medicines: "Tab Combiflam 1-0-1, Crepe Bandage", notes: "Apply ice packs 3 times daily. Keep foot elevated.", date: new Date().toLocaleDateString() }
];

// Mongoose Schema Definitions
const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  slot: { type: String, required: true },
  status: { type: String, default: "Scheduled" },
  reason: { type: String, required: true }
}, { timestamps: true });

const InvoiceSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  treatmentFee: { type: Number, default: 0 },
  consultFee: { type: Number, default: 500 },
  medFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: "Unpaid" },
  date: { type: String, required: true }
}, { timestamps: true });

const PrescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medicines: { type: String, required: true },
  notes: { type: String, default: "No extra precautions." },
  date: { type: String, required: true }
}, { timestamps: true });

let Appointment, Invoice, Prescription;

// Helper: Read Local JSON DB
function readJsonDb() {
  if (!fs.existsSync(JSON_DB_PATH)) {
    const defaultDb = {
      appointments: DEFAULT_APPOINTMENTS,
      invoices: DEFAULT_INVOICES,
      prescriptions: DEFAULT_PRESCRIPTIONS
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultDb, null, 2), "utf8");
    return defaultDb;
  }
  try {
    const content = fs.readFileSync(JSON_DB_PATH, "utf8");
    return JSON.parse(content);
  } catch (error) {
    logger.log(`[DB Local Error] Failed to parse local JSON DB. Seeding defaults.`, "error");
    return { appointments: [], invoices: [], prescriptions: [] };
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
        
        Appointment = mongoose.model("Appointment", AppointmentSchema);
        Invoice = mongoose.model("Invoice", InvoiceSchema);
        Prescription = mongoose.model("Prescription", PrescriptionSchema);
        
        logger.log(`[DB Setup] MongoDB connected successfully.`, "success");
        
        // Seed MongoDB if empty
        const aptCount = await Appointment.countDocuments();
        if (aptCount === 0) {
          logger.log(`[DB Seeder] Seeding default records into MongoDB collections...`, "info");
          await Appointment.insertMany(DEFAULT_APPOINTMENTS.map(({ id, ...rest }) => rest));
          await Invoice.insertMany(DEFAULT_INVOICES.map(({ id, ...rest }) => rest));
          await Prescription.insertMany(DEFAULT_PRESCRIPTIONS.map(({ id, ...rest }) => rest));
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
      await Appointment.deleteMany({});
      await Invoice.deleteMany({});
      await Prescription.deleteMany({});
      
      await Appointment.insertMany(DEFAULT_APPOINTMENTS.map(({ id, ...rest }) => rest));
      await Invoice.insertMany(DEFAULT_INVOICES.map(({ id, ...rest }) => rest));
      await Prescription.insertMany(DEFAULT_PRESCRIPTIONS.map(({ id, ...rest }) => rest));
      logger.log(`[DB Reset] MongoDB tables flushed & re-seeded.`, "warn");
    } else {
      const freshDb = {
        appointments: DEFAULT_APPOINTMENTS,
        invoices: DEFAULT_INVOICES,
        prescriptions: DEFAULT_PRESCRIPTIONS
      };
      writeJsonDb(freshDb);
      logger.log(`[DB Reset] Local JSON database reset to seeds.`, "warn");
    }
  },

  // APPOINTMENTS
  async getAppointments() {
    if (isMongo) {
      const list = await Appointment.find().sort({ createdAt: 1 });
      return list.map(d => ({
        id: d._id.toString(),
        patientName: d.patientName,
        doctorName: d.doctorName,
        date: d.date,
        slot: d.slot,
        status: d.status,
        reason: d.reason
      }));
    } else {
      return readJsonDb().appointments;
    }
  },

  async addAppointment(data) {
    if (isMongo) {
      const doc = new Appointment({
        patientName: data.patientName,
        doctorName: data.doctorName,
        date: data.date,
        slot: data.slot,
        status: data.status || "Scheduled",
        reason: data.reason
      });
      await doc.save();
      logger.log(`[DB Write] MongoDB appointment created for ${doc.patientName} (ID: ${doc._id})`, "success");
      return { id: doc._id.toString(), ...data };
    } else {
      const dbData = readJsonDb();
      const newApt = {
        id: `apt-${Date.now()}`,
        patientName: data.patientName,
        doctorName: data.doctorName,
        date: data.date,
        slot: data.slot,
        status: data.status || "Scheduled",
        reason: data.reason
      };
      dbData.appointments.push(newApt);
      writeJsonDb(dbData);
      logger.log(`[DB Write] Local JSON appointment created for ${newApt.patientName}`, "success");
      return newApt;
    }
  },

  async updateAppointment(id, updateFields) {
    if (isMongo) {
      const doc = await Appointment.findByIdAndUpdate(id, updateFields, { new: true });
      if (!doc) throw new Error("Appointment not found");
      logger.log(`[DB Update] MongoDB appointment ${id} status toggled to ${doc.status}`, "success");
      return { id: doc._id.toString(), patientName: doc.patientName, status: doc.status };
    } else {
      const dbData = readJsonDb();
      const idx = dbData.appointments.findIndex(a => a.id === id);
      if (idx === -1) throw new Error("Appointment not found");
      dbData.appointments[idx] = { ...dbData.appointments[idx], ...updateFields };
      writeJsonDb(dbData);
      logger.log(`[DB Update] Local JSON appointment ${id} toggled to ${dbData.appointments[idx].status}`, "success");
      return dbData.appointments[idx];
    }
  },

  async deleteAppointment(id) {
    if (isMongo) {
      const doc = await Appointment.findByIdAndDelete(id);
      if (!doc) throw new Error("Appointment not found");
      logger.log(`[DB Delete] MongoDB appointment ${id} cancelled for ${doc.patientName}`, "warn");
      return { id };
    } else {
      const dbData = readJsonDb();
      const name = dbData.appointments.find(a => a.id === id)?.patientName || "Unknown";
      dbData.appointments = dbData.appointments.filter(a => a.id !== id);
      writeJsonDb(dbData);
      logger.log(`[DB Delete] Local JSON appointment ${id} cancelled for ${name}`, "warn");
      return { id };
    }
  },

  // INVOICES
  async getInvoices() {
    if (isMongo) {
      const list = await Invoice.find().sort({ createdAt: 1 });
      return list.map(d => ({
        id: d._id.toString(),
        patientName: d.patientName,
        consultFee: d.consultFee,
        treatmentFee: d.treatmentFee,
        medFee: d.medFee,
        total: d.total,
        status: d.status,
        date: d.date
      }));
    } else {
      return readJsonDb().invoices;
    }
  },

  async addInvoice(data) {
    if (isMongo) {
      const doc = new Invoice({
        patientName: data.patientName,
        consultFee: Number(data.consultFee),
        treatmentFee: Number(data.treatmentFee),
        medFee: Number(data.medFee),
        total: Number(data.total),
        status: data.status || "Unpaid",
        date: data.date
      });
      await doc.save();
      logger.log(`[DB Write] MongoDB invoice compiled for ${doc.patientName} (₹${doc.total})`, "success");
      return { id: doc._id.toString(), ...data };
    } else {
      const dbData = readJsonDb();
      const newInv = {
        id: `inv-${Date.now()}`,
        patientName: data.patientName,
        consultFee: Number(data.consultFee),
        treatmentFee: Number(data.treatmentFee),
        medFee: Number(data.medFee),
        total: Number(data.total),
        status: data.status || "Unpaid",
        date: data.date
      };
      dbData.invoices.push(newInv);
      writeJsonDb(dbData);
      logger.log(`[DB Write] Local JSON invoice compiled for ${newInv.patientName} (₹${newInv.total})`, "success");
      return newInv;
    }
  },

  async updateInvoice(id, updateFields) {
    if (isMongo) {
      const doc = await Invoice.findByIdAndUpdate(id, updateFields, { new: true });
      if (!doc) throw new Error("Invoice not found");
      logger.log(`[DB Update] MongoDB invoice ${id} status toggled to ${doc.status}`, "success");
      return { id: doc._id.toString(), patientName: doc.patientName, status: doc.status };
    } else {
      const dbData = readJsonDb();
      const idx = dbData.invoices.findIndex(i => i.id === id);
      if (idx === -1) throw new Error("Invoice not found");
      dbData.invoices[idx] = { ...dbData.invoices[idx], ...updateFields };
      writeJsonDb(dbData);
      logger.log(`[DB Update] Local JSON invoice ${id} toggled to ${dbData.invoices[idx].status}`, "success");
      return dbData.invoices[idx];
    }
  },

  async deleteInvoice(id) {
    if (isMongo) {
      const doc = await Invoice.findByIdAndDelete(id);
      if (!doc) throw new Error("Invoice not found");
      logger.log(`[DB Delete] MongoDB invoice ${id} deleted for ${doc.patientName}`, "warn");
      return { id };
    } else {
      const dbData = readJsonDb();
      const name = dbData.invoices.find(i => i.id === id)?.patientName || "Unknown";
      dbData.invoices = dbData.invoices.filter(i => i.id !== id);
      writeJsonDb(dbData);
      logger.log(`[DB Delete] Local JSON invoice ${id} removed for ${name}`, "warn");
      return { id };
    }
  },

  // PRESCRIPTIONS
  async getPrescriptions() {
    if (isMongo) {
      const list = await Prescription.find().sort({ createdAt: 1 });
      return list.map(d => ({
        id: d._id.toString(),
        patientName: d.patientName,
        diagnosis: d.diagnosis,
        medicines: d.medicines,
        notes: d.notes,
        date: d.date
      }));
    } else {
      return readJsonDb().prescriptions;
    }
  },

  async addPrescription(data) {
    if (isMongo) {
      const doc = new Prescription({
        patientName: data.patientName,
        diagnosis: data.diagnosis,
        medicines: data.medicines,
        notes: data.notes || "No extra precautions.",
        date: data.date
      });
      await doc.save();
      logger.log(`[DB Write] MongoDB Rx created for ${doc.patientName} (Rx: ${doc.diagnosis})`, "success");
      return { id: doc._id.toString(), ...data };
    } else {
      const dbData = readJsonDb();
      const newRx = {
        id: `rx-${Date.now()}`,
        patientName: data.patientName,
        diagnosis: data.diagnosis,
        medicines: data.medicines,
        notes: data.notes || "No extra precautions.",
        date: data.date
      };
      dbData.prescriptions.push(newRx);
      writeJsonDb(dbData);
      logger.log(`[DB Write] Local JSON Rx created for ${newRx.patientName} (Rx: ${newRx.diagnosis})`, "success");
      return newRx;
    }
  },

  async deletePrescription(id) {
    if (isMongo) {
      const doc = await Prescription.findByIdAndDelete(id);
      if (!doc) throw new Error("Prescription not found");
      logger.log(`[DB Delete] MongoDB prescription record ${id} purged for ${doc.patientName}`, "warn");
      return { id };
    } else {
      const dbData = readJsonDb();
      const name = dbData.prescriptions.find(p => p.id === id)?.patientName || "Unknown";
      dbData.prescriptions = dbData.prescriptions.filter(p => p.id !== id);
      writeJsonDb(dbData);
      logger.log(`[DB Delete] Local JSON Rx record ${id} purged for ${name}`, "warn");
      return { id };
    }
  }
};

module.exports = db;
