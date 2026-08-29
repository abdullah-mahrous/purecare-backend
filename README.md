# PureCare Backend

Backend API for the **PureCare Healthcare at Home** platform.

PureCare Backend powers the website's dynamic content and provides
centralized control over the platform, allowing authorized
administrators to manage website content, healthcare services, medical
equipment rentals, reservations, careers applications, and customer
inquiries without requiring frontend code changes.

## Tech Stack

-   **Node.js** --- JavaScript runtime
-   **Express.js** --- REST API framework
-   **PostgreSQL** --- Relational database
-   **TypeScript** --- Type-safe development
-   **REST API** --- Communication with the PureCare frontend

## Key Capabilities

### Website Content Management

The backend provides full control over dynamic website content,
including:

-   Homepage content
-   About PureCare content
-   FAQs
-   Testimonials
-   How It Works steps
-   Contact information
-   Company information
-   Other configurable website sections

Content should be stored in PostgreSQL rather than hardcoded in the
frontend wherever practical.

### Healthcare Services

Administrators can:

-   Create services
-   Update service information
-   Delete or deactivate services
-   Control service visibility
-   Update descriptions and service-specific information
-   Manage the order in which services appear

The frontend consumes this information through the API, allowing service
content to be changed without redeploying the website.

### Medical Equipment Rental

The backend manages the medical equipment catalog, including:

-   Equipment name
-   Description
-   Category
-   Images
-   Rental price per day
-   Availability status
-   Stock information
-   Equipment-specific information
-   Active/inactive status

The API supports browsing, searching, filtering, pagination, and
retrieving individual equipment details.

### Reservations

Customers can submit service requests through the reservation form.

Reservation data may include:

-   Customer name
-   Phone number
-   Age
-   Address
-   Desired date
-   Requested service
-   Health problem
-   Additional notes
-   Reservation status
-   Creation and update timestamps

The backend provides the structure required for administrators to review
and manage incoming requests.

### Careers & Talent Pool

The careers system allows healthcare professionals and other applicants
to submit their information for future opportunities.

Applications can include:

-   Applicant information
-   Contact details
-   Professional information
-   Experience
-   Qualifications
-   CV/document references where applicable
-   Application status
-   Creation and update timestamps

The goal is to maintain a searchable talent pool that PureCare can
contact when staffing requirements arise.

### Customer Inquiries

The backend can manage general contact requests and inquiries submitted
through the website, providing administrators with a centralized view of
incoming requests.

## API Architecture

The API follows a modular REST architecture.

Example structure:

``` text
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── validators/
├── utils/
├── app.ts
└── server.ts
```

### Responsibilities

**Routes** - Define API endpoints - Connect endpoints to controllers

**Controllers** - Handle HTTP requests and responses - Validate request
flow - Delegate business logic

**Services** - Contain business logic - Handle database operations and
reusable application logic

**Models** - Represent database entities - Define relationships and data
access logic

**Validators** - Validate incoming request data - Prevent invalid or
malformed data from reaching business logic

**Middleware** - Authentication and authorization - Error handling -
Request processing - Security-related middleware

## Database

PostgreSQL is the primary data store.

The database is expected to contain entities such as:

``` text
Users
Services
Service Content
Equipment
Equipment Categories
Reservations
Careers Applications
Testimonials
FAQs
Website Content
Contact Requests
```

Relationships should be modeled using PostgreSQL foreign keys and
appropriate constraints to maintain data integrity.

## Administration

The backend is designed to support a future/admin dashboard that
provides authorized staff with full control over the website.

Administrators should be able to:

-   Manage website content
-   Manage healthcare services
-   Manage equipment and rental prices
-   Update equipment availability
-   Manage FAQs and testimonials
-   Review reservations
-   Review career applications
-   Review customer inquiries

Changes made through the administration system should be reflected on
the public website through the API without requiring frontend
source-code changes.

## API Principles

The API should follow these principles:

-   RESTful resource design
-   Consistent HTTP status codes
-   Centralized error handling
-   Request validation
-   Authentication and role-based authorization
-   Pagination for collection endpoints
-   Filtering and searching where appropriate
-   Consistent response structures
-   Secure handling of sensitive information
-   Environment-based configuration

## Environment Variables

Create a `.env` file locally:

``` env
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://username:password@localhost:5432/purecare

JWT_SECRET=your_secret
```

Never commit secrets or `.env` files to the repository.

## Getting Started

### 1. Clone the repository

``` bash
git clone <repository-url>
cd purecare-backend
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and configure the PostgreSQL connection and
application secrets.

### 4. Set up the database

Create the PostgreSQL database and run the project's migrations/schema
setup.

### 5. Start the development server

``` bash
npm run dev
```

### 6. Build for production

``` bash
npm run build
```

### 7. Start production server

``` bash
npm start
```

## Testing

The project should include automated tests for critical application
logic and API endpoints.

``` bash
npm test
```

## API Documentation

API documentation should be maintained as the API evolves.

Recommended tooling:

-   OpenAPI / Swagger
-   Clearly documented request and response schemas
-   Authentication requirements
-   HTTP status codes
-   Example requests and responses

## Security

Security is a core requirement because the backend handles customer and
applicant information.

The application should implement:

-   Secure password hashing
-   JWT/session-based authentication where required
-   Role-based authorization
-   Input validation
-   SQL injection protection through parameterized queries/ORM or query
    builders
-   CORS configuration
-   Rate limiting for public endpoints where appropriate
-   Secure HTTP headers
-   Environment-based secrets
-   Centralized error handling without exposing sensitive server details

## Project Goal

The PureCare Backend is not simply an API for submitting forms. It is
the **central management layer for the entire PureCare website**,
separating website content and business data from the frontend.

The architecture should make it possible for PureCare staff to update
services, equipment, prices, availability, FAQs, testimonials, and other
website content through an administration interface while keeping the
public frontend independent from hardcoded business data.
