const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./src/database/dbConnect");

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self';");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  res.setHeader("Permission-Policy", "none");
  res.removeHeader("X-Powered-By");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
db.connect();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/", require("./src/route"));

app.listen(PORT, (req, res) => {
  console.log(`Server Running at ${PORT}`);
});
