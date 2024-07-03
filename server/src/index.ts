import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { FileMetadata } from "@shared/types/files";
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const upload = multer({ dest: "uploads/" });

const sharedKeyCredential = new StorageSharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME!,
  process.env.AZURE_STORAGE_ACCOUNT_KEY!
);

const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  sharedKeyCredential
);

const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_CONTAINER_NAME!
);

const filesDataPath = "./filesData.json";

const loadFilesData = (): FileMetadata[] => {
  if (fs.existsSync(filesDataPath)) {
    const data = fs.readFileSync(filesDataPath);
    return JSON.parse(data.toString()) as FileMetadata[];
  }
  return [];
};

const saveFilesData = (files: FileMetadata[]) => {
  fs.writeFileSync(filesDataPath, JSON.stringify(files, null, 2));
};

let files: FileMetadata[] = loadFilesData();

const allowedOrigins = ['http://localhost:3000'];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/upload", upload.single("file"), async (req, res) => {
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

app.get("/files", (req, res) => {
  res.json(files);
});

app.delete("/files/:key", async (req, res) => {
  const fileKey = req.params.key as string;

  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileKey);
    await blockBlobClient.delete();

    files = files.filter((file: FileMetadata) => file.key !== fileKey);
    saveFilesData(files);

    res.status(200).send("File deleted successfully.");
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).send("Failed to delete file.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
