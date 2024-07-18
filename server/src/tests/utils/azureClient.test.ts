import azureBlobService from "../../utils/azureClient";
import * as Azure from "@azure/storage-blob";

jest.mock("@azure/storage-blob");

const mockedAzure = Azure as jest.Mocked<typeof Azure>;

describe("azureClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedAzure.BlobServiceClient.mockImplementation(() => {
      return {
        listContainers: jest
          .fn()
          .mockResolvedValueOnce([
            { name: "container1" },
            { name: "container2" },
          ]),
        getContainerClient: jest.fn().mockReturnValue({
          exists: jest.fn().mockResolvedValue(true),
          createIfNotExists: jest.fn().mockResolvedValue({ created: true }),
        }),
      } as unknown as Azure.BlobServiceClient;
    });
  });

  it("should initialize azureBlobService correctly", async () => {
    expect(azureBlobService.getBlobServiceClient()).toBeDefined();
    expect(azureBlobService.getContainerClient()).toBeDefined();
  });

  it("should return null objects given test credentials", async () => {
    expect(azureBlobService.getBlobServiceClient()).toBeNull();
    expect(azureBlobService.getContainerClient()).toBeNull();
  });
});
