import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
  BASEURL: z.string().min(1, { message: "Base is required" }),
  NODE_ENV: z.string().min(1, { message: "NODE_ENV is required" }).optional(),
  ACCESSTOKEN: z
    .string()
    .min(1, { message: "Access token secret is required" }),
  REFRESHTOKEN: z
    .string()
    .min(1, { message: "Refresh token secret is required" }),
  ACCESSTOKEN_EXPIRE: z
    .string()
    .min(1, { message: "Access token expiry is required" }),
  REFRESHTOKEN_EXPIRE: z
    .string()
    .min(1, { message: "Refresh token expiry is required" }),
});
function createENV(env: NodeJS.ProcessEnv) {
  const validationResult = envSchema.safeParse(env);

  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }

  return validationResult.data;
}

export const env = createENV(process.env);
