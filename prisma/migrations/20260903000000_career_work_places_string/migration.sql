ALTER TABLE "careers" ALTER COLUMN "workPlaces" TYPE TEXT USING CASE
  WHEN "workPlaces" IS NULL THEN NULL
  ELSE "workPlaces" #>> '{}'
END;
