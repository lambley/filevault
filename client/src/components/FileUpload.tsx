import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface FileMetadata {
  name: string;
  key: string;
}

const FileUpload: React.FC = () => {
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => setNote(e.target.value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!note || !file) {
      setError('Please enter a name for the file and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('note', note);
    formData.append('file', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully!');
        setNote('');
        setFile(null);
        setError(null);
        loadFiles();
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Failed to upload file.');
      }
    } catch (err) {
      setError('Failed to upload file.');
    }
  };

  const loadFiles = async () => {
    const response = await fetch('/files');
    const files = await response.json();
    setFiles(files);
  };

  const deleteFile = async (fileKey: string) => {
    try {
      const response = await fetch(`/files/${fileKey}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('File deleted successfully!');
        loadFiles();
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Failed to delete file.');
      }
    } catch (err) {
      setError('Failed to delete file.');
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
        <input type="file" id="fileInput" onChange={handleFileChange} required />
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="notesList">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>File Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file.key}>
                <td>{file.name}</td>
                <td>{file.key}</td>
                <td>
                  <button onClick={() => deleteFile(file.key)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default FileUpload;
