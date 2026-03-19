## Intalled packages

1. express → backend framework
2. pg → connect Node.js to PostgreSQL
3. jsonwebtoken → create login tokens
4. dotenv → load secrets from .env
5. helmet → sets secure HTTP headers
6. express-rate-limit → brute-force protection
7. cors → allow frontend to talk to backend later
8. nodemon → restarts server automatically during development


## Backend project structure

Backend/
    controllers/
      authController.js
      notesController.js

    middleWares/
      authMiddleware.js
      errorHandler.js
      rateLimiter.js
      validationMiddleware.js

    model/
      userModel.js
      noteModel.js

    routes/
      authRoutes.js
      noteRoutes.js

    db.js
    index.js
    .env
    .gitignore


## Security Features

1. Password hashing with bcrypt
2. JWT authentication with expiration
3. Rate limiting on login route
4. Input validation on all endpoints
5. Parameterized SQL queries (prevents SQL injection)
6. Ownership validation for notes (prevents IDOR)
7. Secure HTTP headers via Helmet
8. Controlled CORS configuration
9. Safe error responses (no sensitive leakage)


## OWASP Top 10 Coverage

# Broken Access Control

1. Enforced via user_id checks in all note queries
2. Users can only access their own notes

# Cryptographic Failures

1. Passwords hashed using bcrypt
2. JWT used for secure authentication
3.  Secrets stored in environment variables

# Injection

1. Prevented using parameterized queries ($1, $2)
2. No dynamic SQL string concatenation

# Insecure Design

1. Secure architecture with separation of concerns
2. Authentication required before accessing resources

# Security Misconfiguration

1. Helmet for HTTP headers
2. Environment variables for secrets
3. Controlled CORS

# Vulnerable and Outdated Components

1. Checked using npm audit

# Identification and Authentication Failures

1. Strong password policy
2. Secure login flow
3. Generic error messages
4. Rate limiting for brute-force protection

# Security Logging and Monitoring Failures

1. Basic logging implemented for: failed login attempts, note operations

# Cross-Site Scripting (XSS)

1. Notes stored as plain text

2. Frontend expected to render safely (no raw HTML)

# Server-Side Request Forgery (SSRF)

1. Not applicable. Backend does not make external requests based on user input