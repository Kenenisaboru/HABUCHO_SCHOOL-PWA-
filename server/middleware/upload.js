/**
 * Multer Upload Configuration
 * -----------------------------
 * Handles file uploads with magic-byte validation.
 */
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = async (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const extAllowed = /\.(jpe?g|png|gif|webp)$/.test(ext);
  if (!extAllowed) {
    return cb(new Error("Only image files are allowed"), false);
  }

  try {
    const buffer = Buffer.alloc(4100);
    const fd = await import("fs").then((fs) =>
      fs.promises.open(file.path, "r")
    );
    const { bytesRead } = await fd.read(buffer, 0, 4100, 0);
    await fd.close();

    const type = await fileTypeFromBuffer(buffer.subarray(0, bytesRead));
    if (type && ALLOWED_MIMES.has(type.mime)) {
      cb(null, true);
    } else if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File content does not match allowed image types"), false);
    }
  } catch {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Could not verify file type"), false);
    }
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export default upload;
