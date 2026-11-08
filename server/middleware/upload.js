/**
 * Multer Upload Configuration
 * -----------------------------
 * Handles file uploads with magic-byte validation.
 */
import multer from "multer";
import fs from "node:fs/promises";
import path from "path";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { PRIVATE_UPLOAD_DIR, UPLOAD_DIR } from "../utils/uploadStorage.js";

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const createStorage = (directory) => multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, directory),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const storage = createStorage(UPLOAD_DIR);
const privateStorage = createStorage(PRIVATE_UPLOAD_DIR);

const createExtensionFilter = (extensions, message) => (_req, file, cb) => {
  if (!extensions.has(path.extname(file.originalname).toLowerCase())) {
    const error = new Error(message);
    error.statusCode = 400;
    return cb(error, false);
  }
  cb(null, true);
};

const fileFilter = createExtensionFilter(
  new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]),
  "Only image files are allowed"
);

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

/**
 * Document Upload Configuration
 * ------------------------------
 * Accepts images (jpeg, png, gif, webp) AND PDFs with the same 5 MB limit.
 * Used by the admissions form which allows supporting document uploads.
 */
const DOCUMENT_ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
]);

const documentFileFilter = createExtensionFilter(
  new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"]),
  "Only image and PDF files are allowed"
);

const validateUploadedFiles = (allowedMimes) => async (req, _res, next) => {
  const files = [req.file, ...(Array.isArray(req.files) ? req.files : [])].filter(Boolean);

  try {
    for (const file of files) {
      const handle = await fs.open(file.path, "r");
      const buffer = Buffer.alloc(4100);
      let bytesRead;
      try {
        ({ bytesRead } = await handle.read(buffer, 0, buffer.length, 0));
      } finally {
        await handle.close();
      }

      const content = buffer.subarray(0, bytesRead);
      const type = await fileTypeFromBuffer(content);
      const isPdf = allowedMimes.has("application/pdf") && content.subarray(0, 4).toString("ascii") === "%PDF";
      if ((!type || !allowedMimes.has(type.mime)) && !isPdf) {
        const error = new Error("File content does not match an allowed type");
        error.statusCode = 400;
        throw error;
      }
    }
    return next();
  } catch (error) {
    await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => {})));
    if (!error.statusCode) error.statusCode = 400;
    return next(error);
  }
};

export const documentUpload = multer({
  storage: privateStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: documentFileFilter,
});

export const validateImageUploads = validateUploadedFiles(ALLOWED_MIMES);
export const validateDocumentUploads = validateUploadedFiles(DOCUMENT_ALLOWED_MIMES);

export default upload;
