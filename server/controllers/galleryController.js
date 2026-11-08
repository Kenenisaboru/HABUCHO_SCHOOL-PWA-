/**
 * Gallery Controller
 * ------------------
 * Administrative operations for photo gallery images.
 */
import fs from "fs";
import * as GalleryModel from "../models/galleryModel.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { getUploadPath } from "../utils/uploadStorage.js";

export const getGalleryImages = async (_req, res, next) => {
  try {
    const images = await GalleryModel.getAllGalleryImages();
    return sendSuccess(res, images);
  } catch (err) {
    next(err);
  }
};

export const createGalleryImage = async (req, res, next) => {
  try {
    const { title, caption, display_order } = req.body;
    if (!req.file) {
      return sendError(res, "Image file is required", 400);
    }

    const image_path = `/uploads/${req.file.filename}`;

    const image = await GalleryModel.createGalleryImage({
      title: title || "Gallery Image",
      caption: caption || "",
      image_path,
      display_order: parseInt(display_order, 10) || 0,
      created_by: req.user.id,
    });

    return sendSuccess(res, image, "Image uploaded to gallery successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const deleteGalleryImage = async (req, res, next) => {
  try {
    const deleted = await GalleryModel.deleteGalleryImage(req.params.id);
    if (!deleted) return sendError(res, "Gallery image not found", 404);

    if (deleted.image_path) {
      const filePath = getUploadPath(deleted.image_path);
      if (filePath) fs.unlink(filePath, () => {});
    }

    return sendSuccess(res, { id: req.params.id }, "Image removed from gallery successfully");
  } catch (err) {
    next(err);
  }
};
