const express = require("express");
const router = express.Router();
const { getUserData } = require("./adminController");
// router
router.get("/getUser", getUserData);

module.exports = router;