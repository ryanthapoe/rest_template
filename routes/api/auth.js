// Handle user add, update, delete user
const express = require("express");
const router = express.Router();

// import middleware untuk validasi token
const auth = require("../../middleware/auth");

// import jwt
const jwt = require("jsonwebtoken");

// import bcrypt untuk compare
const bcrypt = require("bcryptjs");

// import global variabel dari config
const config = require("config");

// Import validator
const { check, validationResult } = require("express-validator");

// import user model
const User = require("../../models/User");
/*  Test route get
    Format function rest pada express 
    get(url, callback function);
*/

// @route   GET api/auth
// @desc    Send Token to register route
// @access  Private (Menggunakan Token)
// Param 2 sebagai middleware
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth
// @desc    Authenticate login user
// @access  Public
// Param 2 sebagai middleware
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password Required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Melakukan pengecekan jika array errors kosong maka akan di kirimkan status 400 (error bad request)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructur (ES6) kiriman body dari frontend
    const { email, password } = req.body;

    try {
      // Melakukan pengecekan jika user sudah terdaftar
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          error: [{ msg: "User belum terdaftar" }]
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          error: [{ msg: "Password salah" }]
        });
      }

      // Mengirimkan token jsonwebtoken
      // membuat payload untuk dikirim bersama token
      const payload = {
        user: {
          id: user.id
        }
      };

      /* jwt sign params :
           param 1 : payload = data yang dikirim bersama token
           param 2 : secret = disini kita menyimpan secret di variabel global dari library config
           param 3 : masa aktif token
           param 4 : callback function
        */
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 7200 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
