const { Pool } = require("pg");
const env = require("./config/env");
const logger = require("./utils/logger");

// SECURITY: Using a connection pool with SSL and timeouts.
const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.isProduction ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("connect", () => {
  logger.info("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  logger.error("Unexpected PostgreSQL pool error", { error: err.message });
});

module.exports = pool;