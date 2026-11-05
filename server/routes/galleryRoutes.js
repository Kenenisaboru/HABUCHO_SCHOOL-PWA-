import express from "express";
import {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";
import { authenticateUser, authorizeRoles } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(authenticateUser, authorizeRoles("admin"));

router.get("/", getGalleryImages);
router.post("/", upload.single("image"), createGalleryImage);
router.delete("/:id", deleteGalleryImage);

export default router;
