## Expense Workflow API

A backend API for managing workflows and their expenses with authentication, reporting, and budget tracking.

The system allows users to create workflows (projects with budgets), track expenses inside them, and generate reports about spending and remaining budgets.
***


# Overview

Expense Workflow API is a RESTful backend service that helps users manage budgets across multiple workflows. Each workflow has a budget and contains multiple expenses. The system tracks spending, calculates remaining budgets, and provides reports both at the user level and per workflow.

Key capabilities:

    User authentication using JWT
    Workflow management (create, update, delete, archive)
    Expense tracking within workflows
    Budget usage calculation
    Aggregated reporting and category breakdowns
    Secure API with middleware protections


# Architecture

The project follows a Clean Architecture / Layered Architecture approach to separate responsibilities and keep the business logic independent from frameworks.

Layers:

### Entities

Core business models such as User, Workflow, and Expense.

### Application (Use Cases)

Contains the business logic that coordinates operations such as creating workflows, managing expenses, and generating reports.

### Repositories

Abstractions and implementations responsible for data persistence (PostgreSQL).

### Controllers

Handle HTTP requests, validate inputs, call use cases, and return responses.

### Infrastructure

Includes database configuration and external dependencies.

### Containers (Dependency Injection)

Responsible for wiring repositories, use cases, and controllers together.

### Benefits of this architecture:

    Separation of concerns
    Easier testing
    Replaceable infrastructure
    Scalable project structure

# Folder Structure
```
src
│
├── application
│   ├── expense
│   ├── report
│   ├── user
│   └── workflow
│
├── controller
│   ├── expense
│   ├── report
│   ├── user
│   └── workflow
│
├── repository
│   ├── expense
│   ├── user
│   └── workflow
│
├── entities
│
├── container
│
├── middleware
│
├── config
│
└── app.ts
```
### Explanation:

application → business logic (use cases)

controller → HTTP layer

repository → database interaction

entities → domain models

container → dependency injection setup

middleware → authentication and request middleware

config → database configuration

app.ts → application entry point



# Tech Stack

Backend

    Node.js
    Express.js
    TypeScript

Database

    PostgreSQL
    node-postgres (pg)

Authentication

    JWT (jsonwebtoken)
    bcryptjs

Security

    Helmet
    CORS
    Express Rate Limit

Infrastructure

    Docker (PostgreSQL container)



# API Endpoints

Authentication
```
POST /register
Register a new user

POST /login
Login user and receive JWT token
```

Workflow
```
POST /workflow
Create workflow

GET /workflows
Get all workflows for current user

PUT /workflow/:id
Update workflow

DELETE /workflow/:id
Delete workflow

PATCH /workflow/:id/archive
Archive workflow

PATCH /workflow/:id/unarchive
Unarchive workflow

```

Expenses
```
POST /workflow/:workflowId/expense
Create expense in workflow

GET /workflow/:workflowId/expenses
Get all expenses in workflow

PUT /workflow/:workflowId/expense/:id
Update expense

DELETE /workflow/:workflowId/expense/:id
Delete expense

Optional query parameters:

    from
    to

Example:

/workflow/1/expenses?from=2024-01-01&to=2024-02-01

```

Reports
```
GET /reports/overview
Returns:

    total workflows
    total budget
    total expenses
    remaining budget
    budget usage percentage
    category breakdown


GET /workflow/:workflowId/report
Returns workflow-specific statistics:

    total expenses
    expense count
    remaining budget
    budget usage percentage
    category breakdown

```

# Authentication Flow

    User registers with email and password
    Password is hashed using bcrypt
    User logs in with credentials
    Server generates JWT token
    Token is sent in Authorization header

### Example:

Authorization: Bearer <token>

    authMiddleware verifies the token
    User ID is extracted and attached to request



# Error Handling

Controllers use try/catch blocks and return consistent HTTP responses.

### Examples:
```
400 Bad Request
Invalid input or validation error

401 Unauthorized
Missing authentication token

403 Forbidden
Invalid or expired token

404 Not Found
Resource does not exist

All errors return JSON:

{
  "error": "Error message"
}

```

# Validation

Validation happens in multiple layers.
```
Controllers

    Validate request parameters
    Validate request body fields

Entities

    Enforce domain rules
    Validate titles, amounts, budgets, etc.

Use Cases

    Ensure business logic rules
    Check ownership and relationships

Example validations:

    workflowId must be a number
    expense amount must be positive
    workflow must belong to the authenticated user
```

# Security Considerations

The API includes several security measures.

Password Security
```
    Passwords hashed with bcrypt
```
Authentication
```
    JWT based authentication
    Tokens required for protected routes
```
Rate Limiting
```
    Login and register endpoints protected from brute-force attacks
```
HTTP Security
```
    Helmet for secure headers
    CORS configuration
```
Data Ownership
```
    Users can only access their own workflows and expenses
```
Database Protection
```
    Parameterized queries to prevent SQL injection
```


# Trade-offs / Design Decisions

## Clean Architecture

The project follows a Clean Architecture style to separate domain logic from infrastructure and frameworks.

This improves maintainability, scalability, and testability, but it also increases the number of files and layers in the project.


## Repository Pattern

Repositories abstract database operations from business logic.

This allows the application layer to remain independent of PostgreSQL and makes it easier to switch databases or mock repositories during testing.

Trade-off:

More abstraction layers and interfaces must be maintained.


## Controllers vs Use Cases

Controllers are intentionally kept thin.

Their only responsibility is handling HTTP requests and responses.

All business logic lives inside use cases in the application layer.

Benefits:

    Easier testing of business logic
    Clear separation between transport layer and domain logic

Trade-off:

    Slightly more boilerplate code.



## Dependency Injection via Container Layer

The project uses a dedicated container folder to handle Dependency Injection.

The container is responsible for:

    Instantiating repositories
    Injecting repositories into use cases
    Injecting use cases into controllers
    Exporting fully wired controllers for routing

Example flow:

Repository → Use Case → Controller

This keeps controllers and use cases decoupled from concrete implementations.

Benefits:

    Easier testing with mocked dependencies
    Clear dependency graph
    Loose coupling between layers

Trade-off:

    Requires an additional setup layer
    Adds some boilerplate compared to directly instantiating classes inside controllers.


## PostgreSQL

PostgreSQL was chosen because the system relies on relational data and aggregations for reporting (totals, category summaries, budget usage).

Benefits:

    Strong relational consistency
    Powerful aggregation queries
    Reliable transactional support

Trade-off:

    Slightly heavier setup compared to embedded databases.


## Docker for Database

Docker is used to run PostgreSQL locally.

Benefits:

    Consistent development environment
    Easy setup for new developers
    Avoids local database configuration issues

Trade-off:

    Requires Docker to be installed.



# Running the Project

Install dependencies
```
npm install
```

```
npx tsc
```

Start backend server
```
node dist/app.js
```


Run PostgreSQL using Docker
```
cd deployment
docker-compose up -d
```


Run database migration
```
node dist/database/migrate
```
