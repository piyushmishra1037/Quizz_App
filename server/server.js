const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const dbConfig = require("./config/dbConfig");

const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const reportsRoute = require("./routes/reportsRoute");

app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", reportsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 5007;
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client" , "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });   
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Database connection status: ${dbConfig.readyState === 1 ? 'Connected' : 'Not Connected'}`);
});
