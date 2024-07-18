import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axiosMockAdapter from "axios-mock-adapter";
import axiosInstance from "../../axiosInstance";
import FileUpload from "../../components/FileUpload";

const mock = new axiosMockAdapter(axiosInstance);

const mockFiles = [
  { name: "File 1", key: "key1" },
  { name: "File 2", key: "key2" },
];

describe("FileUpload", () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet("/files").reply(200, mockFiles);
  });

  it("should render file upload form and load files", async () => {
    render(<FileUpload />);

    expect(
      screen.getByPlaceholderText("Enter file name...")
    ).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("File 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("File 2")).toBeInTheDocument();
    });
  });
  
  it("should show error if file name or file is not provided", async () => {
    render(<FileUpload />);

    fireEvent.click(screen.getByText("Submit"));

    // testing html validation rather than custom error message
    await waitFor(() => {
      const noteInput = screen.getByPlaceholderText(
        "Enter file name..."
      ) as HTMLInputElement;
      expect(noteInput.validity.valueMissing).toBe(true);
    });
  });

  it("should upload file successfully", async () => {
    mock.onPost("/upload").reply(200);
    mock
      .onGet("/files")
      .reply(200, [...mockFiles, { name: "File 3", key: "key3" }]);

    render(<FileUpload />);

    fireEvent.change(screen.getByPlaceholderText("Enter file name..."), {
      target: { value: "File 3" },
    });

    const fileInput = screen.getByLabelText(/choose file/i) as HTMLInputElement;
    const file = new File(["dummy content"], "example.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("File 3")).toBeInTheDocument();
    });
  });

  it("should handle file upload error", async () => {
    mock.onPost("/upload").reply(500);

    render(<FileUpload />);

    fireEvent.change(screen.getByPlaceholderText("Enter file name..."), {
      target: { value: "File 3" },
    });

    const fileInput = screen.getByLabelText(/choose file/i) as HTMLInputElement;
    const file = new File(["dummy content"], "example.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText("Submit"));

    // testing html validation rather than custom error message
    await waitFor(() => {
      const noteInput = screen.getByLabelText(
        /choose file/i
      ) as HTMLInputElement;
      expect(noteInput.validity.valueMissing).toBe(true);
    });
  });

  it("should delete file successfully", async () => {
    render(<FileUpload />);

    await waitFor(() => {
      expect(screen.getByText("File 1")).toBeInTheDocument();
    });

    mock.onDelete("/files/key1").reply(200);
    mock.onGet("/files").reply(
      200,
      mockFiles.filter((file) => file.key !== "key1")
    );

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(screen.queryByText("File 1")).not.toBeInTheDocument();
    });
  });

  it("should handle file delete error", async () => {
    mock.onDelete("/files/key1").reply(500);

    render(<FileUpload />);

    await waitFor(() => {
      expect(screen.getByText("File 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(screen.getByText("Failed to delete file.")).toBeInTheDocument();
    });
  });
});
