import { describe, expect, it } from "vitest";
import { equipmentPatchSchema, equipmentSchema, equipmentPaginationSchema } from "../src/features/equipments/equipments.validation";
import { faqPatchSchema } from "../src/features/faqs/faqs.validation";
import { servicePatchSchema, serviceWriteSchema } from "../src/features/services/services.validation";
import { testimonialPatchSchema } from "../src/features/testimonials/testimonials.validation";
import { siteGlobalDataSchema } from "../src/features/siteGlobalData/siteGlobalData.validation";
import { careerSchema } from "../src/features/careers/careers.validation";
import { reservationSchema } from "../src/features/reservations/reservations.validation";

describe("feature request schemas", () => {
  it("accepts bilingual equipment data", () => {
    const result = equipmentSchema.safeParse({
      nameAr: "كرسي", nameEn: "Chair", descriptionAr: "وصف", descriptionEn: "Description",
      categoryAr: "طبي", categoryEn: "Medical", price: "50", available: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an inverted equipment price range", () => {
    const result = equipmentPaginationSchema.safeParse({ minPrice: "100", maxPrice: "20" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown service fields", () => {
    const result = serviceWriteSchema.safeParse({
      nameAr: "خدمة", nameEn: "Service", descriptionAr: "وصف", descriptionEn: "Description",
      rate: 10, unexpected: "blocked",
    });
    expect(result.success).toBe(false);
  });

  it("accepts partial updates without allowing FAQ service changes", () => {
    expect(servicePatchSchema.safeParse({ nameEn: "Updated service" }).success).toBe(true);
    expect(testimonialPatchSchema.safeParse({ commentEn: "Updated comment" }).success).toBe(true);
    expect(equipmentPatchSchema.safeParse({ price: "25", available: "false" }).success).toBe(true);
    expect(faqPatchSchema.safeParse({ answerEn: "Updated answer" }).success).toBe(true);
    expect(faqPatchSchema.safeParse({ serviceId: "ckxxxxxxxxxxxxxxxxxxxxxxxx" }).success).toBe(false);
  });

  it("accepts a reservation without services", () => {
    const result = reservationSchema.safeParse({
      fullName: "Patient", phoneNumber: "+201000000000", age: 35,
      desiredDate: "2026-09-15T10:00:00.000Z", address: "Address",
      healthIssue: "Health issue",
    });
    expect(result.success).toBe(true);
  });

  it("accepts nullable reservation values and services", () => {
    const result = reservationSchema.safeParse({
      fullName: "Patient", phoneNumber: "+201000000000", age: null,
      desiredDate: "2026-09-15T10:00:00.000Z", address: "Address",
      healthIssue: null, notes: null, serviceIds: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-positive reservation ages", () => {
    const zero = reservationSchema.safeParse({ fullName: "Patient", phoneNumber: "+201000000000", age: 0, desiredDate: "2026-09-15T10:00:00.000Z", address: "Address" });
    const negative = reservationSchema.safeParse({ fullName: "Patient", phoneNumber: "+201000000000", age: -1, desiredDate: "2026-09-15T10:00:00.000Z", address: "Address" });
    expect(zero.success).toBe(false);
    expect(negative.success).toBe(false);
  });

  it("accepts omitted nullable career fields", () => {
    const result = careerSchema.safeParse({
      fullName: "Applicant", phoneNumber: "+201000000000", address: "Address", position: "Nurse",
      nationalId: "https://res.cloudinary.com/example/image/upload/national-id.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("accepts scalar career workPlaces", () => {
    const result = careerSchema.safeParse({
      fullName: "Applicant", phoneNumber: "+201000000000", address: "Address", position: "Nurse",
      nationalId: "https://res.cloudinary.com/example/image/upload/national-id.jpg",
      workPlaces: "Cairo hospital",
    });
    expect(result.success).toBe(true);
    expect(careerSchema.safeParse({
      fullName: "Applicant", phoneNumber: "+201000000000", address: "Address", position: "Nurse",
      nationalId: "https://res.cloudinary.com/example/image/upload/national-id.jpg",
      workPlaces: ["Cairo hospital"],
    }).success).toBe(false);
  });

  it("preserves omitted and explicit null website fields for PATCH", () => {
    const omitted = siteGlobalDataSchema.safeParse({ phoneNumber: "+201000000000" });
    const cleared = siteGlobalDataSchema.safeParse({ introVideoUrl: null });

    expect(omitted.success).toBe(true);
    expect(omitted.success && omitted.data).toEqual({ phoneNumber: "+201000000000" });
    expect(cleared.success).toBe(true);
    expect(cleared.success && cleared.data).toEqual({ introVideoUrl: null });
  });
});
