// Handle user add, update, delete user

const express = require("express");
const router = express.Router();

// import jwt
const jwt = require("jsonwebtoken");

// import global variabel dari config
const config = require("config");

// Import bcrypt untuk hash password
const bcrypt = require("bcryptjs");

// Import validator
const { check, validationResult } = require("express-validator");

// import gravatar package
const gravatar = require("gravatar");

// Import user model
const User = require("../../models/User");

/*  Test route get
    Format function rest pada express 
    get(url, callback function);
*/

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get("/", (req, res) => res.send("users"));

// @route   POST api/users
// @desc    Register user
// @access  Public
// Express validation digunakan di paramaeter ke dua dalam sebuah array yang berisi fungsi check untuk melakukan check setiap data body
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Melakukan pengecekan jika array errors kosong maka akan di kirimkan status 400 (error bad request)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructur (ES6) kiriman body dari frontend
    const { name, email, password } = req.body;

    try {
      // Melakukan pengecekan jika user sudah terdaftar
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({
          error: [{ msg: "User dengan email yang sama telah terdaftar" }]
        });
      }

      // Mengambil gravatar user (untuk foto profile)
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      // Melakukan enkripsi password dengan bcrypt
      user = new User({
        name,
        email,
        avatar
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // Melakukan registrasi user
      await user.save();

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
