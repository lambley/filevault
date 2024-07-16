import fs from "fs";
import path from "path";
import { FileMetadata } from "../../types/files";

const filesDataPath = path.join(__dirname, "../filesData.json");

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

export { loadFilesData, saveFilesData };
