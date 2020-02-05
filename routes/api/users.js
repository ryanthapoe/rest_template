// Handle user add, update, delete user
const express = require("express");
const router = express.Router();

// Instalasi validator
const { check, validationResult } = require("express-validator");

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("users");
  }
);

module.exports = router;
