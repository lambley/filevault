// src/tests/filesRoutes.test.ts
import request from 'supertest';
import express from 'express';
import filesRoutes from '../../routes/filesRoutes';
import path from 'path';
import * as fs from 'fs';
import { FileMetadata } from '@shared/types/files';

const app = express();
app.use(express.json());
app.use('/files', filesRoutes);

describe('filesRoutes', () => {
  let originalFilesData: FileMetadata[];

  beforeAll(() => {
    // Read the actual file data
    const filesDataPath = path.join(__dirname, '../../filesData.json');
    const data = fs.readFileSync(filesDataPath, 'utf-8');
    originalFilesData = JSON.parse(data) as FileMetadata[];
  });

  describe('GET /files', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/files');
      expect(response.statusCode).toBe(200);
    });

    it('should return an array of files', async () => {
      const response = await request(app).get('/files');
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return a non-empty array', async () => {
      const response = await request(app).get('/files');
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return the correct file metadata', async () => {
      const response = await request(app).get('/files');
      expect(response.body).toEqual(originalFilesData);
    });
  });
});
