import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import enVars from "../config/environment";

const configured = Boolean(enVars.cloudinary.cloudName && enVars.cloudinary.apiKey && enVars.cloudinary.apiSecret);
if (configured) {
  const { cloudName, apiKey, apiSecret } = enVars.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Incomplete Cloudinary configuration");
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export const uploadImage = (buffer: Buffer, folder: string) => new Promise<UploadApiResponse>((resolve, reject) => {
  if (!configured) return reject(new Error("Cloudinary is not configured"));
  const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "auto" }, (error, result) => {
    if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
    resolve(result);
  });
  stream.end(buffer);
});

export const deleteMedia = (publicId: string) => new Promise<void>((resolve, reject) => {
  if (!configured) return reject(new Error("Cloudinary is not configured"));
  const resourceTypes = ["image", "video", "raw"] as const;
  const destroy = (index: number) => {
    const resourceType = resourceTypes[index];
    if (!resourceType) return reject(new Error("Cloudinary deletion failed"));
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
      if (error) return reject(error);
      if (result?.result === "ok") return resolve();
      destroy(index + 1);
    });
  };
  destroy(0);
});

export const publicIdFromUrl = (url: string | null | undefined) => {
  if (!url) return undefined;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match?.[1]) return undefined;
  return match[1].replace(/\.[^/.]+$/, "");
};
