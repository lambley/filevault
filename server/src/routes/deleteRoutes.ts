import express from 'express';
import azureBlobService from '../utils/azureClient';
import { loadFilesData, saveFilesData } from '../utils/fileUtils';
import { FileMetadata } from '../../types/files';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const filesDataPath = path.join(__dirname, '../filesData.json');

router.delete('/:key', async (req, res) => {
  const fileKey = req.params.key as string;

  try {
    const containerClient = azureBlobService.getContainerClient();

    if (!containerClient) {
      throw new Error('Container client not initialized.');
    }

    // Delete the file from Azure Blob Storage
    const blockBlobClient = containerClient.getBlockBlobClient(fileKey);
    await blockBlobClient.delete();

    // Load existing files metadata
    let files: FileMetadata[] = [];

    if (fs.existsSync(filesDataPath)) {
      files = loadFilesData();
    }

    // Remove the deleted file's metadata
    files = files.filter((file: FileMetadata) => file.key !== fileKey);

    // Save updated metadata to JSON file
    saveFilesData(files);

    res.status(200).send('File deleted successfully.');
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).send('Failed to delete file.');
  }
});

export default router;
