// security: Centralized environment validation prevents unsafe startup with missing secrets.
require("dotenv").config();

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "JWT_ISSUER",
  "JWT_AUDIENCE",
  "CLIENT_URL",
];

for (const key of requiredEnvVars) {
  if (!process.env[key] || !process.env[key].trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// security: Enforce strong JWT secret length to reduce risk of weak-secret attacks.
if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtIssuer: process.env.JWT_ISSUER,
  jwtAudience: process.env.JWT_AUDIENCE,
  clientUrl: process.env.CLIENT_URL,
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
  logLevel: process.env.LOG_LEVEL || "info",
  isProduction: (process.env.NODE_ENV || "development") === "production",
};

module.exports = env;