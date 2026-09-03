import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/database";
import enVars from "../../config/environment";
import { sendTelegramMessage } from "../../services/telegramService";
import { appError } from "../../utilities/appError";
import { sendSuccess } from "../../utilities/response";

const notify = (message: string) => sendTelegramMessage(message, enVars.telegram.reservationTopicId).catch((error: unknown) => console.error("Telegram notification failed", error));

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceIds = [], ...reservationData } = req.body as { serviceIds?: string[] | null } & Record<string, unknown>;
    const requestedServiceIds = serviceIds ?? [];
    if (requestedServiceIds.length > 0) {
      const services = await prisma.service.findMany({
        where: { id: { in: requestedServiceIds } },
        select: { id: true },
      });
      const existingServiceIds = new Set(services.map((service) => service.id));
      const invalidServiceIds = requestedServiceIds.filter((serviceId) => !existingServiceIds.has(serviceId));
      if (invalidServiceIds.length > 0) {
        return next(new appError(`The following service IDs do not exist: ${invalidServiceIds.join(", ")}`, 400));
      }
    }
    const reservation = await prisma.$transaction(async (transaction) => {
      const created = await transaction.reservation.create({ data: reservationData as never });
      await transaction.reservationService.createMany({ data: requestedServiceIds.map((serviceId) => ({ reservationId: created.id, serviceId })) });
      return transaction.reservation.findUniqueOrThrow({ where: { id: created.id }, include: { services: { include: { service: true } } } });
    });
    notify(["New PureCare reservation", `Name: ${reservation.fullName}`, `Phone: ${reservation.phoneNumber}`, `Age: ${reservation.age}`, `Date: ${reservation.desiredDate.toISOString()}`, `Address: ${reservation.address}`, `Services: ${reservation.services.map(({ service }) => `${service.nameEn} (${service.nameAr})`).join(", ")}`, `Health issue: ${reservation.healthIssue ?? "-"}`, `Notes: ${reservation.notes ?? "-"}`].join("\n"));
    return sendSuccess(res, reservation, 201);
  } catch (error) { return next(error); }
};

export const listReservations = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.reservation.findMany({ include: { services: { include: { service: true } } }, orderBy: { createdAt: "desc" } })); }
  catch (error) { return next(error); }
};