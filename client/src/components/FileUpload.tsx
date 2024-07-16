import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axiosInstance from "../axiosInstance";
import FileTable from "./FileTable";

interface FileMetadata {
  name: string;
  key: string;
}

const FileUpload: React.FC = () => {
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNote(e.target.value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!note || !file) {
      setError("Please enter a name for the file and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("note", note);
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/upload", formData);

      if (response.status === 200) {
        alert("File uploaded successfully!");
        setNote("");
        setFile(null);
        setError(null);
        loadFiles();
      } else {
        setError(response.data || "Failed to upload file.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload file.");
    }
  };

  const loadFiles = async () => {
    try {
      const response = await axiosInstance.get("/files");
      setFiles(response.data);
    } catch (error) {
      console.error("Error loading files:", error);
      setError("Failed to load files.");
    }
  };

  const deleteFile = async (fileKey: string) => {
    try {
      const response = await axiosInstance.delete(`/files/${fileKey}`);

      if (response.status === 200) {
        alert("File deleted successfully!");
        loadFiles();
      } else {
        setError(response.data || "Failed to delete file.");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file.");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <main>
      <form id="noteForm" onSubmit={handleSubmit}>
        <input
          type="text"
          id="note"
          value={note}
          onChange={handleNoteChange}
          placeholder="Enter file name..."
          required
        />
        <br />
        <input
          type="file"
          id="fileInput"
          aria-label="choose file"
          onChange={handleFileChange}
          required
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <FileTable files={files} deleteFile={deleteFile} />
    </main>
  );
};

export default FileUpload;
