import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  ContainerClient,
} from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

let blobServiceClient: BlobServiceClient | null = null;
let containerClient: ContainerClient = {} as ContainerClient;

const initializeAzureClient = async () => {
  try {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      process.env.AZURE_STORAGE_ACCOUNT_NAME!,
      process.env.AZURE_STORAGE_ACCOUNT_KEY!
    );

    blobServiceClient = new BlobServiceClient(
      `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      sharedKeyCredential
    );

    await listContainers();

    containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_CONTAINER_NAME!
    );

    console.log("Azure client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Azure client:", error);
    blobServiceClient = null;
    containerClient = {} as ContainerClient;
    throw error;
  }
};

const listContainers = async () => {
  try {
    if (blobServiceClient) {
      const iter = blobServiceClient.listContainers();
      for await (const container of iter) {
        console.log("Container:", container.name);
      }
    }
  } catch (error) {
    console.error("Error validating Azure connection:", error);
    throw error;
  }
};

initializeAzureClient().catch((error) => {
  console.error("Azure client initialization error:", error);
});

export { blobServiceClient, containerClient };
