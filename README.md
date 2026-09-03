# PureCare Backend

REST API for the PureCare Healthcare at Home platform. The backend powers the public website and gives authenticated administrators control over services, website data, FAQs, testimonials, medical equipment, reservations, careers, and uploaded media.

## Features

- Admin authentication with bcrypt password verification and JWT access tokens.
- Website global data management for contact details, social links, and intro video URL.
- Healthcare service management with Arabic and English names/descriptions, pricing, response time, customer count, and service images.
- Included service and targeted customer CRUD nested under services, including icon uploads and Cloudinary cleanup.
- FAQ management, including global FAQs and service-specific FAQs.
- Bilingual testimonials management.
- Medical equipment catalog with Arabic/English fields, prices, availability, image uploads, search, category filtering, and pagination.
- Public reservation submission for one or more services.
- Admin reservation listing and meaningful validation for invalid service IDs.
- Career application submission using frontend-provided document URLs.
- Admin career listing and deletion with Cloudinary cleanup for stored documents.
- Generic authenticated file uploads and deletion/replacement by Cloudinary URL.
- Asynchronous Telegram notifications for new reservations and career applications.
- Swagger/OpenAPI documentation at `/api-docs`.
- Vercel-compatible serverless deployment.

## Tech Stack

- Node.js
- TypeScript
- Express 4
- PostgreSQL
- Prisma 7
- `@prisma/adapter-pg`
- Zod 4
- JWT (`jsonwebtoken`)
- bcrypt (`bcryptjs`)
- Multer for multipart uploads
- Cloudinary for media storage
- Telegram Bot API for notifications
- Helmet and CORS for HTTP security/configuration
- Swagger UI and `swagger-jsdoc`
- Vitest and Supertest for testing
- Vercel Node runtime for deployment

## Project Structure

```text
api/index.ts                         Vercel serverless entrypoint
server.ts                            Local HTTP server entrypoint
src/
  app.ts                             Express app configuration
  config/                            Environment and Prisma configuration
  features/
    auth/                            Login
    siteGlobalData/                  Website global data
    services/                        Services and child resources
    faqs/                            FAQs
    testimonials/                    Testimonials
    equipments/                      Equipment catalog
    reservations/                    Reservations
    careers/                         Career applications
    uploads/                         Generic media uploads
  middlewares/                       Validation, auth, admin, error handling
  services/                          Cloudinary and Telegram integrations
  swagger/                           OpenAPI definition
  utilities/                         Shared response, upload, and route helpers
prisma/
  schema.prisma                      Database schema
  migrations/                        Versioned database migrations
  seed.ts                            Admin seed script
tests/                               Unit and API/serverless integration tests
```

Each feature owns its routes, controllers, and validation schemas. Prisma operations remain in feature controllers. The Express app is exported separately from `server.ts` so it can run both locally and on Vercel.

## Environment Variables

Create a local `.env` file.

```dotenv
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
DIRECT_URL=postgresql://user:password@host:5432/database
CORS_ORIGIN=http://localhost:3000

JWT_SECRET=replace-with-at-least-32-characters
JWT_EXPIRE=7d

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-at-least-12-characters

CLOUDINARY_CLOUD_NAME=optional-cloud-name
CLOUDINARY_API_KEY=optional-api-key
CLOUDINARY_API_SECRET=optional-api-secret

TELEGRAM_BOT_TOKEN=optional-bot-token
TELEGRAM_CHAT_ID=optional-chat-id
TELEGRAM_RESERVATION_TOPIC_ID=optional-positive-number
TELEGRAM_CAREER_TOPIC_ID=optional-positive-number
```

`DATABASE_URL` is used by the running application. Prisma CLI migrations use `DIRECT_URL` through [prisma.config.ts](prisma.config.ts). Cloudinary and Telegram are optional, but media operations require Cloudinary configuration.

## Getting Started

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run dev
```

The local API runs on `http://localhost:3000` by default.

For development database changes:

```bash
npm run prisma:migrate -- --name describe-your-change
npm run prisma:generate
```

For a production or Vercel database, apply committed migrations with:

```bash
npm run prisma:deploy
```

## Testing and Build

```bash
npm run build
npm test
```

The build runs strict TypeScript checking. Tests include validation unit tests, API integration tests, and Vercel serverless handler tests. Database integration tests require `TEST_DATABASE_URL`; without it, those tests are skipped.
