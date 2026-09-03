# PureCare Backend Agent Guide

## Project Shape

- TypeScript CommonJS Express API; the application entry points are [server.ts](server.ts) and [src/app.ts](src/app.ts).
- Each API feature owns its route and controller in [src/controllers](src/controllers): `auth`, `siteGlobalData`, `services`, `faqs`, `testimonials`, `equipments`, `reservations`, `careers`, and `uploads`.
- Shared middleware, external integrations, database configuration, and utilities remain in their respective top-level directories. Each feature keeps its Zod schemas beside its routes and controllers.
- Keep Prisma operations in feature controllers; do not introduce a repository layer unless the change genuinely needs one.
- Keep API documentation in [src/swagger/swaggerDocs.ts](src/swagger/swaggerDocs.ts) synchronized with endpoint changes.

## Commands

```text
npm install
npm run dev
npm run build
npm test
npm run prisma:generate
npm run prisma:migrate -- --name <migration-name>
npm run prisma:deploy
npm run prisma:seed
```

- `npm run build` is the strict TypeScript check; there is no configured lint script.
- Vercel uses [api/index.ts](api/index.ts) as the serverless entrypoint; keep it exporting the Express app and do not import [server.ts](server.ts) from serverless code because it starts a listener.
- Prisma CLI commands read `DIRECT_URL` from [prisma.config.ts](prisma.config.ts). Runtime Prisma connections use `DATABASE_URL`.
- Use the existing migration workflow for schema changes and regenerate Prisma client types afterward.
- Database integration tests require `TEST_DATABASE_URL`; otherwise focus on validation tests or report that database tests were skipped.

## API Conventions

- Apply Zod validation in route middleware. Schemas are generally strict, IDs are Prisma CUIDs, and collection pagination defaults to page `1`, limit `20`, with a maximum limit of `100`.
- Successful responses generally use `{ success: true, data }`; creates return `201` and deletes return `204`.
- Reuse [src/utilities/response.ts](src/utilities/response.ts), [src/utilities/adminRoute.ts](src/utilities/adminRoute.ts), and [src/utilities/upload.ts](src/utilities/upload.ts) instead of duplicating response, admin middleware, or Multer setup.
- Use `AppError` from [src/utilities/appError.ts](src/utilities/appError.ts) for expected HTTP errors and pass controller failures to `next(error)`. Preserve `{ success: false, message }` error responses.
- PATCH handlers must distinguish omitted fields from explicit `null`: update only supplied properties and preserve omitted values. For service nested collections, follow the existing replacement behavior when the collection is supplied.
- Protect admin endpoints with `authMiddleware` followed by `adminMiddleware`; clients authenticate with `Authorization: Bearer <token>`.

## Files and External Services

- Multipart upload behavior belongs in the upload routes/controllers and Cloudinary integration. Respect existing Multer limits and delete replaced/deleted Cloudinary media where the resource owns media.
- Telegram notifications are asynchronous and must remain non-blocking; notification failure must not fail a successful reservation or career submission.
- Never read, print, commit, or hardcode `.env` secrets. Update an example/configuration documentation only with placeholders.
- The checked-in `.d.ts` files under `src/` are generated artifacts; avoid editing them manually. Build output is emitted to `dist/`.

See [README.md](README.md) for the product overview and API capabilities, and [prisma/schema.prisma](prisma/schema.prisma) for the authoritative data model.