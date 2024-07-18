import express from 'express';
import fs from 'fs';
import path from "path";
import { FileMetadata } from '../../types/files';

const router = express.Router();

const filesDataPath = path.join(__dirname, "../filesData.json");

const loadFilesData = (): FileMetadata[] => {
  if (fs.existsSync(filesDataPath)) {
    const data = fs.readFileSync(filesDataPath);
    return JSON.parse(data.toString()) as FileMetadata[];
  }
  return [];
};

const files: FileMetadata[] = loadFilesData();

router.get('/', (req, res) => {
  res.json(files);
});

export default router;
