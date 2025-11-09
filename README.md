# Astro Data Framework - MVP

AI-ready astro data framework with FastAPI backend and Next.js frontend.

## Project Structure

```
vibecoding/
├── backend/
│   ├── pyproject.toml          # Python dependencies (uv)
│   ├── config.py               # Configuration settings (environment variables)
│   ├── database.py             # Async SQLAlchemy database connection
│   ├── models.py               # Star SQLAlchemy model
│   ├── main.py                 # FastAPI application with routes
│   ├── .env.example            # Example environment variables file
│   ├── .env                    # Your actual environment variables (not in git)
│   └── .gitignore
│
└── frontend/
    ├── package.json            # Node.js dependencies
    ├── tsconfig.json           # TypeScript configuration
    ├── next.config.js          # Next.js configuration
    ├── tailwind.config.js      # Tailwind CSS configuration
    ├── postcss.config.js       # PostCSS configuration
    ├── .eslintrc.json          # ESLint configuration
    ├── .gitignore
    └── app/
        ├── layout.tsx          # Root layout
        ├── page.tsx            # Home page
        ├── globals.css         # Global styles with Tailwind
        └── stars/
            └── page.tsx        # Stars page with table and form
```

## Prerequisites

### Backend
- Python 3.11+
- [uv](https://github.com/astral-sh/uv) - Fast Python package installer
- PostgreSQL database

### Frontend
- Node.js 18+ and npm

## Setup Instructions

### Backend Setup

1. **Install uv** (if not already installed):
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Install dependencies** (pyproject.toml is already configured):
   ```bash
   uv sync
   ```
   
   Alternatively, if you need to add dependencies manually:
   ```bash
   uv add fastapi uvicorn[standard] sqlalchemy asyncpg pydantic pydantic-settings
   ```

5. **Configure database connection**:
   - Copy the example environment file: `cp .env.example .env`
   - Edit `.env` with your database credentials:
     ```bash
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=your_username  # On macOS with Homebrew, this is usually your system username
     DB_PASSWORD=           # Leave empty if no password is set
     DB_NAME=astrodb
     ```
   - The configuration is loaded from environment variables, making it portable across different machines
   - If `.env` file doesn't exist, the app will use sensible defaults

6. **Set up PostgreSQL database** (if not already done):
   - Install PostgreSQL: `brew install postgresql@16`
   - Start PostgreSQL: `brew services start postgresql@16`
   - Create database: `createdb astrodb` (or use the username from your `.env` file)
   - To stop PostgreSQL: `brew services stop postgresql@16`

7. **Run the backend**:
   ```bash
   uv run uvicorn main:app --reload
   ```

   The backend will run on `http://localhost:8000`

   - API docs available at: `http://localhost:8000/docs`
   - Alternative docs at: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the frontend**:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

4. **Access the application**:
   - Home page: `http://localhost:3000`
   - Stars page: `http://localhost:3000/stars`

## API Endpoints

### GET /stars
Returns all stars from the database.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Sirius",
    "magnitude": -1.46,
    "distance": 8.6,
    "spectral_type": "A1V"
  }
]
```

### GET /stars/{star_id}
Returns a single star by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Sirius",
  "magnitude": -1.46,
  "distance": 8.6,
  "spectral_type": "A1V"
}
```

**Error Response (404):**
```json
{
  "detail": "Star with ID 999 not found"
}
```

### POST /stars
Creates a new star in the database. **Prevents duplicates** - if a star with the same name already exists, returns a 409 error.

**Request Body:**
```json
{
  "name": "Sirius",
  "magnitude": -1.46,
  "distance": 8.6,
  "spectral_type": "A1V"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "name": "Sirius",
  "magnitude": -1.46,
  "distance": 8.6,
  "spectral_type": "A1V"
}
```

**Error Response (409) - Duplicate:**
```json
{
  "detail": "Star with name 'Sirius' already exists (ID: 1)"
}
```

### DELETE /stars/{star_id}
Deletes a star from the database by ID.

**Success Response (204):** No content

**Error Response (404):**
```json
{
  "detail": "Star with ID 999 not found"
}
```

## Database Model

### Star Model
- `id` (Integer, Primary Key)
- `name` (String, Required)
- `magnitude` (Float, Required)
- `distance` (Float, Required) - Distance in light-years
- `spectral_type` (String, Required)

## Development Notes

- **Configuration**: Database credentials are loaded from environment variables (`.env` file)
  - Copy `.env.example` to `.env` and update with your credentials
  - The configuration is portable and works across different machines
  - Environment variables can override `.env` file values
- The database tables are automatically created on backend startup
- CORS is configured to allow requests from `http://localhost:3000`
- The backend uses async SQLAlchemy for database operations
- The frontend uses Next.js App Router with TypeScript
- Tailwind CSS is used for styling

## Environment Variables

The application uses the following environment variables (with defaults):

- `DB_HOST` - Database host (default: `localhost`)
- `DB_PORT` - Database port (default: `5432`)
- `DB_USER` - Database user (default: `postgres`)
- `DB_PASSWORD` - Database password (optional, default: `None`)
- `DB_NAME` - Database name (default: `astrodb`)
- `DEBUG` - Debug mode (default: `true`)

These can be set in a `.env` file or as environment variables. The `.env` file is ignored by git for security.

## Features

- ✅ **Duplicate Prevention**: The API prevents adding stars with duplicate names
- ✅ **CRUD Operations**: Create, Read, Delete operations available
- ✅ **Error Handling**: Proper HTTP status codes and error messages
- ✅ **Environment Configuration**: Database credentials loaded from environment variables
- ✅ **Auto Table Creation**: Database tables are created automatically on startup

## Next Steps

- Add UPDATE operation (PUT/PATCH endpoint)
- Add pagination for stars list
- Add filtering and sorting
- Add authentication
- Add data validation and error handling
- Add tests
- Add Docker configuration

