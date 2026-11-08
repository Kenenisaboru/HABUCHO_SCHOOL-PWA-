import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR || path.join(serverDirectory, "uploads")
);
export const PRIVATE_UPLOAD_DIR = path.resolve(
  process.env.PRIVATE_UPLOAD_DIR || path.join(serverDirectory, "private_uploads")
);

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(PRIVATE_UPLOAD_DIR, { recursive: true });

export const getUploadPath = (uploadUrl) => {
  if (typeof uploadUrl !== "string" || !uploadUrl.startsWith("/uploads/")) return null;
  const filename = path.basename(uploadUrl);
  if (!filename || filename === ".") return null;
  return path.join(UPLOAD_DIR, filename);
};

export const getPrivateUploadPath = (filename) => {
  if (typeof filename !== "string") return null;
  const safeFilename = path.basename(filename);
  if (!safeFilename || safeFilename === ".") return null;
  return path.join(PRIVATE_UPLOAD_DIR, safeFilename);
};