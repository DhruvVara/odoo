const router = require("express").Router();

router.use("/auth", require("./api/auth/authRoute"));
router.use("/administrator", require("./api/administrator/adminRoute"));

module.exports = router;
