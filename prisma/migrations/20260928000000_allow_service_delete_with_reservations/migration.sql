-- UpdateForeignKey
ALTER TABLE "reservation_services"
DROP CONSTRAINT "reservation_services_serviceId_fkey";

-- AddForeignKey
ALTER TABLE "reservation_services"
ADD CONSTRAINT "reservation_services_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "services"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
