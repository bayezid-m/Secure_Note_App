const crypto = require("crypto");

// security: Adding a per-request ID to improve tracing and incident investigation.
const attachRequestId = (req, res, next) => {
  req.requestId = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
};

module.exports = { attachRequestId };