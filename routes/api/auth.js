// Handle user add, update, delete user
const express = require("express");
const router = express.Router();

/*  Test route get
    Format function rest pada express 
    get(url, callback function);
*/

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get("/", (req, res) => res.send("auth"));

module.exports = router;
