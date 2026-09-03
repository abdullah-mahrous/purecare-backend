import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import enVars from "./environment";

const adapter = new PrismaPg({ connectionString: enVars.databaseUrl });
const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  await prisma.$connect();
  console.log("DB connected successfully");
};

const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log("DB disconnected");
};

export { connectDB, disconnectDB, prisma };
