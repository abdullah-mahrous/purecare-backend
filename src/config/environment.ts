import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { z } from "zod";

config();

const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRE: z.string().default("7d"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email"),
  ADMIN_PASSWORD: z.string().min(12, "ADMIN_PASSWORD must be at least 12 characters"),
  CORS_ORIGIN: z.union([z.string().url(), z.literal("*")]).default("*"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  TELEGRAM_BOT_TOKEN: z.string().min(1).optional(),
  TELEGRAM_CHAT_ID: z.string().min(1).optional(),
  TELEGRAM_RESERVATION_TOPIC_ID: z.coerce.number().int().positive().optional(),
  TELEGRAM_CAREER_TOPIC_ID: z.coerce.number().int().positive().optional(),
});

const parsedEnvironment = environmentSchema.parse(process.env);

const enVars = {
  port: parsedEnvironment.PORT,
  databaseUrl: parsedEnvironment.DATABASE_URL,
  directUrl: parsedEnvironment.DIRECT_URL,
  jwt: {
    secret: parsedEnvironment.JWT_SECRET,
    expire: parsedEnvironment.JWT_EXPIRE as jwt.SignOptions["expiresIn"],
  },
  admin: {
    email: parsedEnvironment.ADMIN_EMAIL,
    password: parsedEnvironment.ADMIN_PASSWORD,
  },
  corsOrigin: parsedEnvironment.CORS_ORIGIN,
  cloudinary: {
    cloudName: parsedEnvironment.CLOUDINARY_CLOUD_NAME,
    apiKey: parsedEnvironment.CLOUDINARY_API_KEY,
    apiSecret: parsedEnvironment.CLOUDINARY_API_SECRET,
  },
  telegram: {
    botToken: parsedEnvironment.TELEGRAM_BOT_TOKEN,
    chatId: parsedEnvironment.TELEGRAM_CHAT_ID,
    reservationTopicId: parsedEnvironment.TELEGRAM_RESERVATION_TOPIC_ID,
    careerTopicId: parsedEnvironment.TELEGRAM_CAREER_TOPIC_ID,
  },
};

export default enVars;
