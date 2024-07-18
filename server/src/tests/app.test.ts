import request from 'supertest';
import app from '../app';
import azureBlobService from '../utils/azureClient';

jest.mock('../utils/azureClient', () => ({
  __esModule: true,
  default: {
    getContainerClient: jest.fn().mockReturnValue({
      getBlockBlobClient: jest.fn().mockReturnValue({
        uploadFile: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      }),
      listBlobsFlat: jest.fn().mockResolvedValue({
        byPage: jest.fn().mockReturnValue({
          next: jest.fn().mockResolvedValue({ value: { segment: { blobItems: [] } } }),
        }),
      }),
    }),
    initialize: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('app.ts', () => {
  beforeAll(async () => {
    await azureBlobService.initialize();
  });

  describe('CORS configuration', () => {
    it('should allow requests from allowed origins', async () => {
      const response = await request(app).options('/upload').set('Origin', 'http://localhost:3000');
      expect(response.header['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    it('should reject requests from disallowed origins', async () => {
      const response = await request(app).options('/upload').set('Origin', 'http://disallowed-origin.com');
      expect(response.header['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('Route initialization', () => {
    it('should have the POST /upload route', async () => {
      const response = await request(app).post('/upload');
      expect(response.statusCode).not.toBe(404);
    });

    it('should have the GET /files route', async () => {
      const response = await request(app).get('/files');
      expect(response.statusCode).not.toBe(404);
    });

    it('should have the DELETE /files route', async () => {
      const response = await request(app).delete('/files/some-file-key');
      expect(response.statusCode).not.toBe(404);
    });
  });
});
