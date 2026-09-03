import bcrypt from "bcryptjs";
import { prisma } from "../src/config/database";
import enVars from "../src/config/environment";

const seed = async () => {
  const passwordHash = await bcrypt.hash(enVars.admin.password, 12);

  await prisma.admin.upsert({
    where: { email: enVars.admin.email },
    update: { passwordHash, name: "PureCare Admin" },
    create: {
      email: enVars.admin.email,
      passwordHash,
      name: "PureCare Admin",
    },
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: Error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
