const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const pool = require("./db");
require("dotenv").config();

const env = require("./config/env");
const logger = require("./utils/logger");

const { apiRateLimiter } = require("./middleWares/rateLimiter");
const { attachRequestId } = require("./middleWares/requestIdMiddleware");

const app = express();

// security: Attach a request ID to every request for traceability.
app.use(attachRequestId);

// security: Secure HTTP headers to reduce common web attack surface.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// security: Restrict browser access to the allowed frontend origin only.
app.use(
  cors({
    origin: env.clientUrl,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// security: Limit JSON payload size to reduce abuse and resource exhaustion.
app.use(express.json({ limit: "10kb" }));

// security: Log HTTP traffic in a structured way; useful for monitoring and debugging.
// security: Add requestId to morgan logs
morgan.token("requestId", (req) => req.requestId);
app.use(
  morgan(':requestId :method :url :status :response-time ms', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// security: Apply generic rate limiting to reduce API abuse.
app.use("/api", apiRateLimiter);

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

//const PORT = process.env.PORT || 5000;

app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port}`, {
    environment: env.nodeEnv,
  });
});