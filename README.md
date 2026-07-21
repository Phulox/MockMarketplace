# MockMarketplace

A RESTful backend API built with Node.js and Express, simulating core marketplace functionality — user accounts, authentication, and CRUD operations — built as hands-on prep for a backend/payments internship.

## Overview

MockMarketplace is a mini marketplace API that models the backend logic behind a real e-commerce/marketplace platform. It currently covers user management and authentication, with wallet, payment, and logistics features planned as the project grows.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Authentication:** JSON Web Tokens (jsonwebtoken), bcrypt for password hashing
- **Environment config:** dotenv
- **Testing:** Postman (collection included conceptually — see Testing section)

## Features

### Authentication

- User signup with hashed passwords (bcrypt)
- Login with credential verification and JWT issuance
- Protected routes requiring a valid Bearer token
- Ownership-based authorization (users can only modify/delete their own accounts)

### User Management (CRUD)

- Create, read, update, and delete user records
- Input validation on all routes
- Consistent, meaningful HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `500`)

### REST Conventions

- Pagination on list endpoints (`?page=` and `?limit=` query parameters)
- Defensive handling of malformed input (e.g. non-numeric IDs)
- Generic, non-revealing error messages on auth failures (prevents user enumeration)

### Error Handling

- Async routes wrapped in try/catch to prevent unhandled crashes
- Centralized 404 handler for unmatched routes

## Project Structure

```
MockMarketplace/
├── server.js          # All routes and middleware (single file, current stage)
├── package.json
├── .env               # SECRET_KEY and other environment variables (not committed)
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js installed
- npm

### Installation

```bash
git clone https://github.com/your-username/MockMarketplace.git
cd MockMarketplace
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
SECRET_KEY=your-secret-key-here
```

### Running the server

```bash
npm run dev
```

Server runs on `http://localhost:3000` by default.

## API Endpoints

### Auth

| Method | Endpoint  | Description                    | Auth Required |
| ------ | --------- | ------------------------------ | ------------- |
| POST   | `/signup` | Create a new user account      | No            |
| POST   | `/login`  | Authenticate and receive a JWT | No            |

### Users

| Method | Endpoint     | Description                      | Auth Required |
| ------ | ------------ | -------------------------------- | ------------- |
| GET    | `/users`     | List all users (paginated)       | Yes           |
| GET    | `/users/:id` | Get a single user by ID          | Yes           |
| PUT    | `/users/:id` | Update a user (own account only) | Yes           |
| DELETE | `/users/:id` | Delete a user (own account only) | Yes           |

**Pagination example:**

```
GET /users?page=1&limit=10
```

**Authenticated requests:**

```
Authorization: Bearer <token>
```

## Testing

All endpoints were tested manually and iteratively using Postman, organized into a collection with:

- Environment variables for the base URL (`{{baseUrl}}`)
- An auto-captured auth token variable (`{{authToken}}`), set automatically on successful login via a post-response script

## Roadmap

This project is being built incrementally as part of a 6-week backend prep plan. Planned additions:

- [ ] PostgreSQL database (replacing in-memory storage)
- [ ] Double-entry ledger system for a user wallet
- [ ] 5% commission split logic on transactions
- [ ] Mock courier API integration with a quote aggregator
- [ ] Scheduled batch payouts
- [ ] Basic fraud/velocity-check rules
- [ ] API versioning (`/v1/`, `/v2/`)

## Notes

This is a learning/portfolio project built to develop practical skills in REST API design, authentication, and payment-adjacent backend systems — not a production system. Current data storage is in-memory and resets on server restart.