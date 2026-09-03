import { z } from "zod";

export const deleteUploadSchema = z.object({
  mediaUrl: z.string().url(),
}).strict();
