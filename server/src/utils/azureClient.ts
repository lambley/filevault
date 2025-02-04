import { BlobServiceClient, StorageSharedKeyCredential, ContainerClient } from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

class AzureBlobService {
  private blobServiceClient: BlobServiceClient | null = null;
  private containerClient: ContainerClient | null = null;
  private accountName: string;
  private accountKey: string;
  private containerName: string;

  constructor(
    accountName: string = process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
    accountKey: string = process.env.AZURE_STORAGE_ACCOUNT_KEY || '',
    containerName: string = process.env.AZURE_CONTAINER_NAME || '',
  ) {
    this.accountName = accountName;
    this.accountKey = accountKey;
    this.containerName = containerName;
  }

  public async initialize(): Promise<void> {
    // Check if environment variables are set
    if (!this.accountName || !this.accountKey || !this.containerName) {
      console.error('Azure Blob Service credentials are missing.');
      this.blobServiceClient = null;
      this.containerClient = null;
      return;
    }

    try {
      const sharedKeyCredential = new StorageSharedKeyCredential(this.accountName, this.accountKey);

      this.blobServiceClient = new BlobServiceClient(
        `https://${this.accountName}.blob.core.windows.net`,
        sharedKeyCredential,
      );

      await this.listContainers();

      this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);

      console.log('Azure client initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize Azure client:', error);
      this.blobServiceClient = null;
      this.containerClient = null;
      throw new Error('Azure Blob Service initialization failed.');
    }
  }

  private async listContainers(): Promise<void> {
    try {
      if (this.blobServiceClient) {
        const iter = this.blobServiceClient.listContainers();
        for await (const container of iter) {
          console.log('Container:', container.name);
        }
      }
    } catch (error) {
      console.error('Error validating Azure connection:', error);
      throw new Error('Error validating Azure connection.');
    }
  }

  public getContainerClient(): ContainerClient | null {
    return this.containerClient;
  }

  public getBlobServiceClient(): BlobServiceClient | null {
    return this.blobServiceClient;
  }
}

const azureBlobService = new AzureBlobService();
azureBlobService.initialize().catch((error) => {
  console.error('Azure client initialization error:', error.message);
});

export default azureBlobService;
