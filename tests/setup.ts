process.env.DATABASE_URL ??= process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/purecare_test";
process.env.JWT_SECRET ??= "test-secret-that-is-at-least-32-characters-long";
process.env.ADMIN_EMAIL ??= "admin@example.com";
process.env.ADMIN_PASSWORD ??= "test-admin-password";
process.env.CORS_ORIGIN ??= "http://localhost:3000";
