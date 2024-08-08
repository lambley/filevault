import express from 'express';
import multer from 'multer';
import fs from 'fs';
import azureBlobService from '../utils/azureClient';
import { loadFilesData, saveFilesData } from '../utils/fileUtils';
import { FileMetadata } from '../../types/files';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  const fileName = req.body.note as string;
  if (!fileName) {
    return res.status(400).send('File name is required.');
  }

  if (req.file) {
    try {
      const containerClient = azureBlobService.getContainerClient();

      if (!containerClient) {
        throw new Error('Container client not initialized.');
      }

      const blobName = fileName;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadFile(req.file.path);
      fs.unlinkSync(req.file.path);

      // Create new file metadata
      const newFileMetadata: FileMetadata = {
        name: fileName,
        key: blobName,
        url: `${containerClient.url}/${blobName}`,
        size: req.file.size,
      };

      // Load existing files metadata
      const files = loadFilesData();

      // Update metadata
      files.push(newFileMetadata);

      // Save updated metadata to JSON file
      saveFilesData(files);

      res.status(200).send('File uploaded successfully.');
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).send('Failed to upload file.');
    }
  } else {
    res.status(400).send('No file uploaded.');
  }
});

export default router;
