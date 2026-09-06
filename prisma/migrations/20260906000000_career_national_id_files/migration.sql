ALTER TABLE "careers"
ALTER COLUMN "nationalIdUrl" TYPE TEXT[]
USING ARRAY["nationalIdUrl"];