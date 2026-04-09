const env = require("../config/env");
const logger = require("../utils/logger");

// security: Centralized error handling prevents stack traces and internal details from leaking to clients.
const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled application error", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    error: err.message,
  });

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error" : err.message,
    requestId: req.requestId,
    ...(env.nodeEnv !== "production" && { debug: err.message }),
  });
};

module.exports = errorHandler;