import { Request, Response, NextFunction } from "express";
import { appError } from "../../utilities/appError";
import { deleteMedia, publicIdFromUrl, uploadImage } from "../../services/cloudinaryService";

export const upload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return next(new appError("A file is required", 400));
    const result = await uploadImage(req.file.buffer, "purecare");
    const mediaUrl = typeof req.body.mediaUrl === "string" && req.body.mediaUrl !== "null" ? req.body.mediaUrl : undefined;
    const oldPublicId = publicIdFromUrl(mediaUrl);
    if (mediaUrl && !oldPublicId) {
      await deleteMedia(result.public_id).catch((cleanupError) => console.error("Upload cleanup failed", cleanupError));
      return next(new appError("mediaUrl must be a Cloudinary URL", 400));
    }
    if (oldPublicId) await deleteMedia(oldPublicId);
    return res.status(201).json({ success: true, data: { url: result.secure_url, publicId: result.public_id } });
  } catch (error) { return next(error); }
};

export const deleteUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publicId = publicIdFromUrl(req.body.mediaUrl);
    if (!publicId) return next(new appError("mediaUrl must be a Cloudinary URL", 400));
    await deleteMedia(publicId);
    return res.status(204).send();
  } catch (error) { return next(error); }
};