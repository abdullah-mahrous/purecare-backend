import multer from "multer";

export const memoryUpload = (fileFilter?: multer.Options["fileFilter"]) => multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  ...(fileFilter ? { fileFilter } : {}),
});

export const anyFileUpload = memoryUpload((_req, _file, callback) => callback(null, true));