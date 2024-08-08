import express from 'express';
import { FileMetadata } from '../../types/files';
import azureBlobService from '../utils/azureClient';
import { loadFilesData } from '../utils/fileUtils';

const router = express.Router();

// Function to list files in Azure Blob Storage
const listFilesInAzureBlob = async (): Promise<FileMetadata[]> => {
  const files: FileMetadata[] = [];

  try {
    const containerClient = azureBlobService.getContainerClient();

    if (containerClient) {
      // List all blobs in the container
      const blobIterator = containerClient.listBlobsFlat();

      for await (const blob of blobIterator) {
        const fileMetadata: FileMetadata = {
          name: blob.name,
          key: blob.name,
          url: `${containerClient.url}/${blob.name}`,
          size: blob.properties.contentLength,
        };

        files.push(fileMetadata);
      }
    } else {
      throw new Error('Azure Blob Service client is not initialized.');
    }
  } catch (error) {
    console.error('Error retrieving files from Azure Blob Storage:', error);
    throw error;
  }

  return files;
};

// Endpoint to get files
router.get('/', async (_req, res) => {
  let files: FileMetadata[];
  try {
    if (azureBlobService.getContainerClient()) {
      // Attempt to retrieve files from Azure Blob Storage
      files = await listFilesInAzureBlob();
    } else {
      console.log('Azure Blob Service not initialized. Using local JSON backup.');
      // Use local JSON backup if Azure Blob Service is not initialized
      files = loadFilesData();
    }
    res.json(files);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
