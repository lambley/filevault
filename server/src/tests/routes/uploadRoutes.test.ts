import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';
import uploadRoutes from '../../routes/uploadRoutes';

// Mock Multer
jest.mock('multer', () => () => ({
  single: () => (req: Request, res: Response, next: NextFunction) => {
    req.file = { path: 'tempFilePath', size: 12345 } as Express.Multer.File;
    next();
  },
}));

// Mock Azure Blob Service
jest.mock('../../utils/azureClient', () => ({
  getContainerClient: jest.fn().mockReturnValue({
    getBlockBlobClient: jest.fn().mockReturnValue({
      uploadFile: jest.fn().mockResolvedValue({}),
    }),
    listBlobsFlat: jest.fn().mockReturnValue({
      [Symbol.asyncIterator]: jest.fn().mockReturnValue({
        next: jest
          .fn()
          .mockResolvedValueOnce({
            value: { name: 'test-file.txt', properties: { contentLength: 12345 } },
            done: false,
          })
          .mockResolvedValueOnce({ value: undefined, done: true }),
      }),
    }),
    url: 'http://fakeurl',
  }),
}));

// Mock fs
jest.mock('fs', () => ({
  unlinkSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(false),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  createReadStream: jest.fn(() => {
    const stream = new PassThrough();
    stream.end('file content');
    return stream;
  }),
}));

const app = express();
app.use(express.json());
app.use('/upload', uploadRoutes);

// Utility to create a temporary file
const createTempFile = (content: string): string => {
  const filePath = path.join(__dirname, 'tempFile.txt');
  fs.writeFileSync(filePath, content);
  return filePath;
};

describe('uploadRoutes.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if file name is missing', async () => {
    const filePath = createTempFile('file content');

    const response = await request(app).post('/upload').attach('file', filePath);

    expect(response.status).toBe(400);
    expect(response.text).toBe('File name is required.');
  });

  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app).post('/upload').field('note', 'test-file.txt');

    expect(response.status).toBe(400);
    expect(response.text).toBe('File name is required.');
  });
});
