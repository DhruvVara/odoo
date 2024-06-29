const router = require("express").Router();

router.use("/auth", require("./api/auth/authRoute"));


module.exports = router;
