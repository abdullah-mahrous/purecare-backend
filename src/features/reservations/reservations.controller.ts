import { Request, Response, NextFunction } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/database";
import enVars from "../../config/environment";
import { sendTelegramMessage } from "../../services/telegramService";
import { appError } from "../../utilities/appError";
import { sendSuccess } from "../../utilities/response";

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { serviceIds = [], ...reservationData } = req.body as { serviceIds?: string[] | null } & Record<string, unknown>;
        const requestedServiceIds = serviceIds ?? [];
        const services = await prisma.service.findMany({
            where: { id: { in: requestedServiceIds } },
            select: { id: true, nameEn: true },
        });

        if (requestedServiceIds.length > 0) {
            const existingServiceIds = new Set(services.map((service) => service.id));
            const invalidServiceIds = requestedServiceIds.filter((serviceId) => !existingServiceIds.has(serviceId));

            if (invalidServiceIds.length > 0)
                return next(new appError(`The following service IDs do not exist: ${invalidServiceIds.join(", ")}`, 400));
        }

        const reservation = await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
            const created = await transaction.reservation.create({ data: reservationData as never });

            const servicesById = new Map(services.map((service) => [service.id, service]));
            await transaction.reservationService.createMany({
                data: requestedServiceIds.map((serviceId) => {
                    const service = servicesById.get(serviceId);
                    if (!service) throw new appError(`Service ${serviceId} was not found`, 400);
                    return {
                        reservationId: created.id,
                        serviceNameEn: service.nameEn,
                    };
                }),
            });

            return transaction.reservation.findUniqueOrThrow({ where: { id: created.id }, include: { services: true } });
        });

        const notificationLines = [
            "New PureCare reservation",
            `Name: ${reservation.fullName}`,
            `Phone: ${reservation.phoneNumber}`,
            ...(reservation.age !== null && reservation.age !== undefined && reservation.age >= 0 ? [`Age: ${reservation.age}`] : []),
            `Date: ${reservation.desiredDate.toISOString()}`,
            `Address: ${reservation.address}`,
            `Services: ${reservation.services.map(({ serviceNameEn }) => serviceNameEn).join(", ")}`,
            ...(reservation.healthIssue && reservation.healthIssue.trim() ? [`Health issue: ${reservation.healthIssue.trim()}`] : []),
            ...(reservation.notes && reservation.notes.trim() ? [`Notes: ${reservation.notes.trim()}`] : []),
        ];

        try {
            await sendTelegramMessage(notificationLines.join("\n"), enVars.telegram.reservationTopicId);
        }
        catch (error) {
            console.error("Failed to notify about new reservation", error);
        }

        return sendSuccess(res, reservation, 201);
    } catch (error) {
        return next(error);
    }
};

export const listReservations = async (_req: Request, res: Response, next: NextFunction) => {
    try { 
        return sendSuccess(res, await prisma.reservation.findMany({ include: { services: true }, orderBy: { createdAt: "desc" } })); 
    }
    catch (error) { 
        return next(error); 
    }
};