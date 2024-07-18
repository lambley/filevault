import express from 'express';
import azureBlobService from '../utils/azureClient';
import { loadFilesData, saveFilesData } from '../utils/fileUtils';
import { FileMetadata } from '../../types/files';

const router = express.Router();

let files: FileMetadata[] = loadFilesData();

router.delete('/:key', async (req, res) => {
  const fileKey = req.params.key as string;

  try {
    const containerClient = azureBlobService.getContainerClient();

    if (!containerClient) {
      throw new Error('Container client not initialized.');
    }

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
