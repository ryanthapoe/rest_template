// Main entry file
const express = require("express");

// Mengambil connectDB dari config/db
const connectDB = require("./config/db.js");

const app = express();

// Melakukan koneksi ke database
connectDB();

// Inisialisasi Middleware
// use body parser yang sudah ada di express
app.use(express.json({ extended: false }));

// Contoh mengaplikasikan get request
app.get("/", (req, res) => console.log("Server Running"));

// Mengambil route dari folder routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

/*  
    Inisialisasi port untuk mendeteksi port environment projek
    Jika tidak ada port dalam environment projek maka nilai default menjadi 5000
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running at PORT ${PORT}`));
