# Intalled packages

1. express → backend framework
2. pg → connect Node.js to PostgreSQL
3. jsonwebtoken → create login tokens
4. dotenv → load secrets from .env
5. helmet → sets secure HTTP headers
6. express-rate-limit → brute-force protection
7. cors → allow frontend to talk to backend later
8. nodemon → restarts server automatically during development
9.  express-validator – Input validation and sanitization
10. morgan – HTTP request logging
11. compression – Response compression
12. cookie-parser – Cookie parsing (for future improvements)


# Backend project structure

Backend/

    config/
      env.js

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

    utils/
      logger.js

    db.js
    index.js
    .env
    .gitignore


# Security Features

1. Input validation using express-validator to prevent malformed or unsafe input
2. Rate limiting using express-rate-limit to prevent brute-force attacks
3. Secure HTTP headers using helmet
4. Structured logging using morgan and custom logger
5. Request tracing using unique request IDs
6. Centralized error handling to prevent sensitive information leakage
7. Password hashing using bcrypt
8. JWT authentication with strict verification
9. Environment variable validation to prevent misconfiguration


# OWASP Top 10 Coverage

## A01 Broken Access Control

1. Enforced via user_id checks in all note queries
2. Users can only access their own notes

## Cryptographic Failures

1. Passwords hashed using bcrypt
2. JWT used for secure authentication
3.  Secrets stored in environment variables

## Injection

1. Prevented using parameterized queries ($1, $2)
2. No dynamic SQL string concatenation

## Insecure Design

1. Secure architecture with separation of concerns
2. Authentication required before accessing resources

## Security Misconfiguration

1. Helmet for HTTP headers
2. Environment variables for secrets
3. Controlled CORS

## Vulnerable and Outdated Components

1. Checked using npm audit

## Identification and Authentication Failures

1. Strong password policy
2. Secure login flow
3. Generic error messages
4. Rate limiting for brute-force protection

## Security Logging and Monitoring Failures

1. Basic logging implemented for: failed login attempts, note operations

## Cross-Site Scripting (XSS)

1. Notes stored as plain text

2. Frontend expected to render safely (no raw HTML)

## Server-Side Request Forgery (SSRF)

1. Not applicable. Backend does not make external requests based on user input


# API Endpoints

## 🔐 Auth

- **POST /api/auth/register**  
  Register new user  
  - Validation: email format, strong password  
  - Rate limited

- **POST /api/auth/login**  
  Login user and receive JWT  
  - Rate limited  
  - Returns JWT token

---

## Notes (Protected)

- All routes require:  
- `Authorization: Bearer <token>`

- **POST /api/notes/create**  
  Create note  
  - Input validation applied

- **GET /api/notes/getAll**  
  Get all user notes  
  - Returns only authenticated user’s notes

- **GET /api/notes/singleNote/:id**  
  Get single note  
  - Access control: user can only access own notes

- **PUT /api/notes/update/:id**  
  Update note  
  - Validation + ownership check

- **DELETE /api/notes/delete/:id**  
  Delete note  
  - Ownership check enforced

---

### Security Highlights

- JWT authentication on protected routes  
- Input validation using `express-validator`  
- Rate limiting on auth endpoints  
- Access control using `user_id` checks  
- Parameterized SQL queries (prevents injection)