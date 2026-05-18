# Secure Notes Frontend

React + Bootstrap frontend for the Secure Note Application backend, set up for **Create React App**.

## Features

- User registration
- User login
- Protected dashboard
- Create, edit, delete notes
- Search notes in UI
- Bootstrap alerts for success and error messages
- Client-side validation aligned with backend validation
- Safe note rendering without `dangerouslySetInnerHTML`
- Session-based token storage

## Setup

1. Copy `.env.example` to `.env`
2. Set your backend API URL:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

3. Install dependencies:

```bash
npm install
```

4. Run development server:

```bash
npm start
```

## Backend compatibility

This frontend matches these backend routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/notes/create`
- `GET /api/notes/getAll`
- `PUT /api/notes/update/:id`
- `DELETE /api/notes/delete/:id`

## Frontend security notes

- React escapes note content by default, reducing XSS risk.
- No raw HTML rendering is used.
- Routes are protected in the UI, but backend authorization remains the real security control.
- Token is stored in `sessionStorage` because the current backend returns a Bearer token in JSON. For stronger production security, an `HttpOnly` secure cookie flow would be better.
