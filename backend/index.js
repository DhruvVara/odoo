const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./src/database/dbConnect");
const setupCronJobs = require("./src/common/scheduler/exam-cron-job");
const axios = require('axios');
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

const jobTimes = {
  job1: { hour: 19, minute: 49, date: 29, month: 6 },
  // job2: { hour: 14, minute: 40 } 
};
setupCronJobs(jobTimes);

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

const adminRouter = require("./src/api/administrator/adminRoute");
app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/", require("./src/route"));

async function fetchAndLogUserData() {
  try {
    const response = await axios.get(`http://localhost:${PORT}/api/v1/admin/getUser`);
    console.log('User data from API:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error fetching user data:', error.message);
  }
}
fetchAndLogUserData()

app.listen(PORT, (req, res) => {
  console.log(`Server Running at ${PORT}`);
});
