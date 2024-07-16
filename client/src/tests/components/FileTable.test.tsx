import { render, fireEvent, screen } from "@testing-library/react";
import FileTable from "../../components/FileTable";
import { FileMetadata } from "../../../types/files";

describe("FileTable", () => {
  const mockFiles: FileMetadata[] = [
    { name: "File 1", key: "key1" },
    { name: "File 2", key: "key2" },
  ];

  const mockDeleteFile = jest.fn();

  it("should render the correct number of rows", () => {
    render(<FileTable files={mockFiles} deleteFile={mockDeleteFile} />);
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
  });

  it("should display file names and keys", () => {
    render(<FileTable files={mockFiles} deleteFile={mockDeleteFile} />);

    mockFiles.forEach((file) => {
      expect(screen.getByText(file.name)).toBeInTheDocument();
      expect(screen.getByText(file.key)).toBeInTheDocument();
    });
  });

  it("should call deleteFile when delete button is clicked", () => {
    render(<FileTable files={mockFiles} deleteFile={mockDeleteFile} />);
    const deleteButtons = screen.getAllByText("Delete");

    deleteButtons.forEach((button, index) => {
      fireEvent.click(button);
      expect(mockDeleteFile).toHaveBeenCalledWith(mockFiles[index].key);
    });

    expect(mockDeleteFile).toHaveBeenCalledTimes(mockFiles.length);
  });
});
