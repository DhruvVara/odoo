const express = require("express");
const router = express.Router();
const { signUp, login } = require("./authController");

router.post("/signup", signUp);
router.post("/login", login);

module.exports = router;
