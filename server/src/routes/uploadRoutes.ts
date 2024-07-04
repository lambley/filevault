import express from "express";
import multer from "multer";
import fs from "fs";
import { containerClient } from "../utils/azureClient";
import { loadFilesData, saveFilesData } from "../utils/fileUtils";
import { FileMetadata } from "@shared/types/files";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

let files: FileMetadata[] = loadFilesData();

router.post("/", upload.single("file"), async (req, res) => {
  const fileName = req.body.note as string;
  if (!fileName) {
    return res.status(400).send("File name is required.");
  }

  if (req.file) {
    try {
      const blobName = req.file.filename;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadFile(req.file.path);
      fs.unlinkSync(req.file.path); // remove the file locally after upload

      files.push({ name: fileName, key: blobName });
      saveFilesData(files);

      res.status(200).send("File uploaded successfully.");
    } catch (err) {
      console.error("Error uploading file:", err);
      res.status(500).send("Failed to upload file.");
    }
  } else {
    res.status(400).send("No file uploaded.");
  }
});

export default router;
