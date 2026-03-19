const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();


const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10kb" }));

//routes
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

//middleWares
const errorHandler = require("./middleWares/errorHandler");

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Server is running",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Route DB error:", error.message);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});