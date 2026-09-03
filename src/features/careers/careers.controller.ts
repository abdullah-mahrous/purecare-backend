import { Request, Response, NextFunction } from "express";
import enVars from "../../config/environment";
import { prisma } from "../../config/database";
import { deleteMedia, publicIdFromUrl } from "../../services/cloudinaryService";
import { sendTelegramMessage } from "../../services/telegramService";
import { sendSuccess } from "../../utilities/response";

const notify = (message: string) => sendTelegramMessage(message, enVars.telegram.careerTopicId).catch((error: unknown) => console.error("Telegram notification failed", error));

export const createCareer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nationalId, graduationCertificate, professionalLicenseCard, ...careerFields } = req.body;
    const career = await prisma.career.create({
      data: {
        ...careerFields,
        nationalIdUrl: nationalId,
        graduationCertificateUrl: graduationCertificate,
        professionalLicenseCardUrl: professionalLicenseCard,
      },
    });
    notify(["New PureCare career application", `Name: ${career.fullName}`, `Phone: ${career.phoneNumber}`, `YOE: ${career.yoe}`, `Position: ${career.position}`].join("\n"));
    return sendSuccess(res, career, 201);
  } catch (error) { return next(error); }
};

export const listCareers = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.career.findMany({ orderBy: { createdAt: "desc" } })); }
  catch (error) { return next(error); }
};

export const deleteCareer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const career = await prisma.career.delete({ where: { id: req.params.id as string } });

    await Promise.all([career.nationalIdUrl, career.graduationCertificateUrl, career.professionalLicenseCardUrl].map(publicIdFromUrl).filter((id): id is string => Boolean(id)).map((id) => deleteMedia(id).catch((error) => console.error("Career media cleanup failed", error))));
    
    return res.status(204).send();
  } catch (error) { return next(error); }
};