const jwt = require("jsonwebtoken");
const config = require("config");

// Middleware function adalah fungsi yang mendapat akses ke param req dan res
// param next adalah callback fungsi yang akan di jalankan ke middleware selanjutnya
module.exports = function(req, res, next) {
  // Mengambil token dari header
  const token = req.header("x-auth-token");

  // Cek jika tidak ada token
  if (!token) {
    return res.status(401).json({ msg: "token tidak ada, akses di tutup" });
  }

  // Melakukan Verifikasi token
  try {
    /* jwt.verify param
        param 1 : token yang dikirim dari frontend
        param 2 : secret = disini diambil dari global variabel config
    */
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token tidak berlaku" });
  }
};
