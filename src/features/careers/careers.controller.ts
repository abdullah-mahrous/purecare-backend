import { Request, Response, NextFunction } from "express";
import enVars from "../../config/environment";
import { prisma } from "../../config/database";
import { deleteMedia, publicIdFromUrl, uploadImage } from "../../services/cloudinaryService";
import { sendTelegramMessage } from "../../services/telegramService";
import { sendSuccess } from "../../utilities/response";
import { appError } from "../../utilities/appError";

export const createCareer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const nationalIdFiles = files?.nationalId ?? [];
    if (!nationalIdFiles.length) return next(new appError("At least one national ID file is required", 400));
    const uploadedFiles: { field: string; result: Awaited<ReturnType<typeof uploadImage>> }[] = [];
    let career;
    try {
      for (const [field, fieldFiles] of Object.entries(files ?? {})) {
        for (const file of fieldFiles) uploadedFiles.push({ field, result: await uploadImage(file.buffer, "purecare/careers") });
      }
      const urls = (field: string) => uploadedFiles.filter((uploaded) => uploaded.field === field).map((uploaded) => uploaded.result.secure_url);
      const nationalIdUrls = urls("nationalId");
      const graduationCertificateUrls = urls("graduationCertificate");
      const professionalLicenseCardUrls = urls("professionalLicenseCard");
      career = await prisma.career.create({
        data: {
          ...req.body,
          nationalIdUrl: nationalIdUrls,
          graduationCertificateUrl: graduationCertificateUrls[0],
          professionalLicenseCardUrl: professionalLicenseCardUrls[0],
        },
      });
    } catch (error) {
      await Promise.all(uploadedFiles.map(({ result }) => deleteMedia(result.public_id).catch((cleanupError) => console.error("Career upload cleanup failed", cleanupError))));
      throw error;
    }

    const notificationLines = [
      "New PureCare career application",
      `Name: ${career.fullName}`,
      `Phone: ${career.phoneNumber}`,
      ...(career.age !== null && career.age !== undefined && career.age >= 0 ? [`Age: ${career.age}`] : []),
      ...(career.yoe !== null && career.yoe !== undefined && career.yoe >= 0 ? [`YOE: ${career.yoe}`] : []),
      `Position: ${career.position}`,
      ...(career.workPlaces && career.workPlaces.trim() ? [`Work places: ${career.workPlaces.trim()}`] : []),
    ];

    try {
      await sendTelegramMessage(notificationLines.join("\n"), enVars.telegram.careerTopicId);
    }
    catch (error) {
      console.error("Failed to notify about new career application", error);
    }
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

    await Promise.all([...career.nationalIdUrl, career.graduationCertificateUrl, career.professionalLicenseCardUrl].map(publicIdFromUrl).filter((id): id is string => Boolean(id)).map((id) => deleteMedia(id).catch((error) => console.error("Career media cleanup failed", error))));
    
    return res.status(204).send();
  } catch (error) { return next(error); }
};