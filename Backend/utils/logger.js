const env = require("../config/env");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
};

const currentLevel = levels[env.logLevel] ?? levels.info;

const shouldLog = (level) => levels[level] <= currentLevel;

const formatLog = (level, message, meta = {}) => {
  return JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  });
};

const logger = {
  info(message, meta = {}) {
    if (shouldLog("info")) console.log(formatLog("info", message, meta));
  },
  warn(message, meta = {}) {
    if (shouldLog("warn")) console.warn(formatLog("warn", message, meta));
  },
  error(message, meta = {}) {
    if (shouldLog("error")) console.error(formatLog("error", message, meta));
  },
};

module.exports = logger;