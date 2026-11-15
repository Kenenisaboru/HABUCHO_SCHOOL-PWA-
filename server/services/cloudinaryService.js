/**
 * Cloudinary Media Storage Service
 * ---------------------------------
 * Handles persistent cloud upload for photos, documents, and media.
 * Gracefully falls back to local disk storage if Cloudinary credentials are not configured.
 */
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import logger from "../utils/logger.js";

const isConfigured = Boolean(
  process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
);

if (isConfigured) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

export const isCloudinaryConfigured = () => isConfigured;

/**
 * Upload a local file to Cloudinary and clean up the local copy.
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  if (!isConfigured) return null;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || "habucho_school",
      resource_type: options.resourceType || "auto",
      ...options,
    });

    if (options.cleanup !== false) {
      await fs.unlink(filePath).catch(() => {});
    }

    return result;
  } catch (error) {
    logger.error("Cloudinary upload failed:", error);
    throw error;
  }
};

/**
 * Delete an asset from Cloudinary by its public ID or full URL
 */
export const deleteFromCloudinary = async (publicIdOrUrl) => {
  if (!isConfigured || !publicIdOrUrl) return null;

  try {
    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.startsWith("http://") || publicIdOrUrl.startsWith("https://")) {
      const matches = publicIdOrUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
      if (matches && matches[1]) {
        publicId = matches[1];
      }
    }

    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.warn(`Cloudinary deletion failed for ${publicIdOrUrl}:`, error.message);
    return null;
  }
};

/**
 * Express middleware to upload files to Cloudinary if configured.
 * Seamlessly chains with multer and file type validation.
 */
export const processCloudinaryUpload = (folder = "general") => {
  return async (req, _res, next) => {
    if (!isConfigured) return next();

    try {
      const filesToProcess = [];
      if (req.file) filesToProcess.push(req.file);
      if (Array.isArray(req.files)) filesToProcess.push(...req.files);

      for (const file of filesToProcess) {
        if (file.path) {
          const result = await uploadToCloudinary(file.path, {
            folder: `habucho_school/${folder}`,
            cleanup: true,
          });

          if (result && result.secure_url) {
            file.secure_url = result.secure_url;
            file.url = result.secure_url;
            file.path = result.secure_url;
            file.filename = result.secure_url;
            file.public_id = result.public_id;
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default {
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
  processCloudinaryUpload,
};
