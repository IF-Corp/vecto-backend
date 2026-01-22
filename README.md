# Vecto Backend API

Backend API for the Vecto application built with Fastify, Sequelize, and PostgreSQL following the MVC architecture pattern.

## Features

- **Framework**: Fastify - Fast and low overhead web framework
- **ORM**: Sequelize - Promise-based Node.js ORM for PostgreSQL
- **Architecture**: MVC (Model-View-Controller) design pattern
- **Authentication**: Firebase Google OAuth (handled by frontend)
- **Database**: PostgreSQL

## Project Structure

```
vecto-backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # Database configuration
│   │   └── sequelize.js # Sequelize instance
│   ├── controllers/     # Request handlers
│   │   └── userController.js
│   ├── middleware/      # Custom middleware
│   │   └── errorHandler.js
│   ├── migrations/      # Database migrations
│   │   └── YYYYMMDDHHMMSS-create-users-table.js
│   ├── models/          # Sequelize models
│   │   ├── index.js
│   │   └── User.js
│   ├── routes/          # API routes
│   │   ├── index.js
│   │   └── userRoutes.js
│   ├── utils/           # Utility functions
│   │   └── logger.js
│   ├── app.js           # Fastify app setup
│   └── server.js        # Server entry point
├── .env.example         # Environment variables template
├── .sequelizerc         # Sequelize CLI configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd vecto-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vecto_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
```

4. Create the PostgreSQL database:
```bash
createdb vecto_db
```

Or using psql:
```sql
CREATE DATABASE vecto_db;
```

5. Run database migrations:
```bash
npm run migrate
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Users
- `POST /api/users` - Create or update user (upsert)
  - Body: `{ "email": "user@example.com", "name": "John Doe" }`
- `GET /api/users/:id` - Get user by ID
- `GET /api/users?email=user@example.com` - Get user by email
- `PUT /api/users/:id` - Update user profile
  - Body: `{ "name": "New Name", "is_onboarded": true }`
- `PATCH /api/users/:id/onboarding` - Update onboarding status
  - Body: `{ "is_onboarded": true }`

## Database Migrations

Run migrations:
```bash
npm run migrate
```

Undo last migration:
```bash
npm run migrate:undo
```

Undo all migrations:
```bash
npm run migrate:undo:all
```

## User Model

The `users` table has the following columns:

- `id` (UUID, Primary Key) - Unique identifier
- `email` (String, Unique) - User email address
- `name` (String, Nullable) - User display name
- `is_onboarded` (Boolean, Default: false) - Onboarding status
- `created_at` (Timestamp) - Record creation timestamp
- `updated_at` (Timestamp) - Record update timestamp

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `HOST` | Server host | 0.0.0.0 |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | vecto_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `CORS_ORIGIN` | CORS allowed origin | * |

## Development

### Code Structure

The project follows the MVC pattern:

- **Models** (`src/models/`): Define database schema and relationships
- **Controllers** (`src/controllers/`): Handle business logic
- **Routes** (`src/routes/`): Define API endpoints and link to controllers

### Error Handling

Global error handling is implemented in `src/middleware/errorHandler.js` and handles:
- Validation errors
- Sequelize errors (unique constraints, validation)
- Generic server errors


## License

MIT