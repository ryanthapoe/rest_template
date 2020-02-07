/* melakukan koneksi ke database mongo */

const mongoose = require("mongoose");

// Mengambil variabel global dari config
// Inisialisasi config
const config = require("config");

// mengambil value dari config
const dbURI = config.get("mongoURI");

// Melakukan koneksi ke database
const connectDB = async () => {
  try {
    // mongoose.connect mengirimkan promise
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Database terhubung...");
  } catch (err) {
    // Jika koneksi gagal
    console.error(err.message);
    // Keluar dari proses
    process.exit(1);
  }
};

// Export modul db agar dapat digunakan di file lain
module.exports = connectDB;
