import request from "supertest";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import app from "../src/app";
import { prisma } from "../src/config/database";
import bcrypt from "bcryptjs";

const databaseTests = describe.skipIf(!process.env.TEST_DATABASE_URL);

it("reports a healthy API", async () => {
  const response = await request(app).get("/api/health");
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({ success: true, message: "Server is running" });
});

it("rejects invalid login input", async () => {
  const response = await request(app).post("/api/auth/login").send({ email: "invalid", password: "" });
  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});

databaseTests("supports admin login, protected content, and equipment filters", () => {
  let token = "";
  let equipmentId = "";
  const serviceIds: string[] = [];
  let reservationId = "";

  beforeAll(async () => {
    await prisma.admin.upsert({
      where: { email: process.env.ADMIN_EMAIL as string },
      update: { passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 4) },
      create: {
        email: process.env.ADMIN_EMAIL as string,
        passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 4),
        name: "Test Admin",
      },
    });
    for (const nameEn of ["Integration Nursing", "Integration Physiotherapy"]) {
      const service = await prisma.service.create({
        data: {
          nameAr: nameEn, nameEn, descriptionAr: "وصف", descriptionEn: "Description",
          imgUrl: "https://example.com/service.jpg", rate: 100, responseTime: "1 hour",
        },
      });
      serviceIds.push(service.id);
    }
  });

  afterAll(async () => {
    if (equipmentId) await prisma.equipment.delete({ where: { id: equipmentId } });
    if (reservationId) await prisma.reservation.delete({ where: { id: reservationId } });
    await prisma.service.deleteMany({ where: { id: { in: serviceIds } } });
    await prisma.$disconnect();
  });

  it("logs in the seeded admin", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.token).toEqual(expect.any(String));
    token = response.body.data.token;
  });

  it("requires authentication for equipment writes", async () => {
    const response = await request(app).post("/api/equipment").send({});
    expect(response.status).toBe(401);
  });

  it("creates and filters equipment", async () => {
    const created = await request(app)
      .post("/api/equipment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nameAr: "جهاز اختبار", nameEn: "Integration Walker",
        descriptionAr: "وصف", descriptionEn: "Test equipment",
        categoryAr: "اختبار", categoryEn: "Testing", price: 125, available: true,
      });
    expect(created.status).toBe(201);
    equipmentId = created.body.data.id;

    const response = await request(app).get("/api/equipment?search=Integration&minPrice=100&maxPrice=200");
    expect(response.status).toBe(200);
    expect(response.body.data.items.some((item: { id: string }) => item.id === equipmentId)).toBe(true);
  });

  it("creates a reservation with multiple services", async () => {
    const created = await request(app).post("/api/reservations").send({
      fullName: "Integration Patient", phoneNumber: "+201000000000", age: 35,
      desiredDate: "2026-09-15T10:00:00.000Z", address: "Test address",
      serviceIds, healthIssue: "Test health issue", notes: "Test notes",
    });
    expect(created.status).toBe(201);
    reservationId = created.body.data.id;
    expect(created.body.data.services).toHaveLength(2);
    expect(created.body.data.services.map((entry: { service: { id: string } }) => entry.service.id)).toEqual(expect.arrayContaining(serviceIds));
  });
});
