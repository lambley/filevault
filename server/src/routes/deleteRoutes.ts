import express from 'express';
import fs from 'fs';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { FileMetadata } from '@shared/types/files';

const router = express.Router();

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

const filesDataPath = './filesData.json';

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

router.delete('/:key', async (req, res) => {
  const fileKey = req.params.key as string;

  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileKey);
    await blockBlobClient.delete();

    files = files.filter((file: FileMetadata) => file.key !== fileKey);
    saveFilesData(files);

    res.status(200).send('File deleted successfully.');
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).send('Failed to delete file.');
  }
});

export default router;
