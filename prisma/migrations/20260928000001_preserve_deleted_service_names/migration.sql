-- Store only the historical English service name.
ALTER TABLE "reservation_services"
ADD COLUMN "id" TEXT,
ADD COLUMN "serviceNameEn" TEXT;

UPDATE "reservation_services" AS rs
SET
    "id" = md5(random()::text || clock_timestamp()::text || rs."reservationId" || rs."serviceId"),
    "serviceNameEn" = s."nameEn"
FROM "services" AS s
WHERE rs."serviceId" = s."id";

ALTER TABLE "reservation_services"
ALTER COLUMN "id" SET NOT NULL,
ALTER COLUMN "serviceNameEn" SET NOT NULL,
DROP CONSTRAINT "reservation_services_pkey";

ALTER TABLE "reservation_services"
ADD CONSTRAINT "reservation_services_pkey" PRIMARY KEY ("id");

ALTER TABLE "reservation_services"
DROP CONSTRAINT "reservation_services_serviceId_fkey";

ALTER TABLE "reservation_services"
DROP COLUMN "serviceId";
