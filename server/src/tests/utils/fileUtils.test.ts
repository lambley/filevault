import fs from "fs";
import path from "path";
import { FileMetadata } from "../../../types/files";
import { loadFilesData, saveFilesData } from "../../utils/fileUtils";

jest.mock("fs");

const testData: FileMetadata[] = [
  { name: "TestDocument1", key: "testDocument1.pdf" },
  { name: "TestImage2", key: "testImage2.jpg" },
];

describe("fileUtils", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe("loadFilesData", () => {
    it("should load files data from existing file", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(testData));

      const files = loadFilesData();
      expect(files).toEqual(testData);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve(__dirname, "../../filesData.json")
      );
    });

    it("should return an empty array if file does not exist", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const files = loadFilesData();
      expect(files).toEqual([]);
      expect(fs.existsSync).toHaveBeenCalledWith(
        path.resolve(__dirname, "../../filesData.json")
      );
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    it("should throw an error if JSON parsing fails", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue("invalid json");

      expect(() => {
        loadFilesData();
      }).toThrow(SyntaxError);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve(__dirname, "../../filesData.json")
      );
    });
  });

  describe("saveFilesData", () => {
    it("should save files data to file", () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      const newData: FileMetadata[] = [
        { name: "NewDocument", key: "newDocument.pdf" },
      ];
      saveFilesData(newData);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.resolve(__dirname, "../../filesData.json"),
        JSON.stringify(newData, null, 2)
      );
    });

    it("should overwrite existing data in file", () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      const newData: FileMetadata[] = [
        { name: "UpdatedDocument", key: "updatedDocument.pdf" },
      ];
      saveFilesData(newData);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.resolve(__dirname, "../../filesData.json"),
        JSON.stringify(newData, null, 2)
      );
    });
  });
});
