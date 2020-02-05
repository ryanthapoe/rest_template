// Main entry file

const express = require("express");

const app = express();

// Contoh mengaplikasikan get request
app.get("/", (req, res) => console.log("Server Running"));

/*  Inisialisasi port untuk mendeteksi port environment projek
    Jika tidak ada port dalam environment projek maka nilai default menjadi 5000
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running at PORT ${PORT}`));
