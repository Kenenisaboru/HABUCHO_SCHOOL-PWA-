import fs from "node:fs/promises";
import path from "node:path";
import pool from "../config/db.js";
import { getPrivateUploadPath, getUploadPath } from "../utils/uploadStorage.js";

const getFilename = (storedPath) =>
  path.posix.basename(String(storedPath).replace(/\\/g, "/"));

export const migrateLegacyAdmissionDocuments = async () => {
  const { rows } = await pool.query(
    "SELECT id, document_paths FROM admission_applications WHERE cardinality(document_paths) > 0"
  );
  let migratedCount = 0;

  for (const application of rows) {
    const filenames = [];

    for (const storedPath of application.document_paths || []) {
      const filename = getFilename(storedPath);
      if (!filename || filename === ".") continue;

      const privatePath = getPrivateUploadPath(filename);
      const publicPath = getUploadPath(`/uploads/${filename}`);
      try {
        await fs.access(privatePath);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        try {
          await fs.copyFile(publicPath, privatePath);
          migratedCount += 1;
        } catch (copyError) {
          if (copyError.code !== "ENOENT") throw copyError;
        }
      }

      await fs.unlink(publicPath).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      });
      filenames.push(filename);
    }

    if (JSON.stringify(filenames) !== JSON.stringify(application.document_paths)) {
      await pool.query(
        "UPDATE admission_applications SET document_paths = $1 WHERE id = $2",
        [filenames, application.id]
      );
    }
  }

  if (migratedCount > 0) {
    console.info(`Moved ${migratedCount} legacy admission document(s) to private storage.`);
  }
};