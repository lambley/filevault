import React from 'react';
import { FileMetadata } from '../../types/files';

interface Props {
  files: FileMetadata[];
  deleteFile: (fileKey: string) => void;
}

const FileTable: React.FC<Props> = ({ files, deleteFile }) => {
  return (
    <div id="notesList">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>File Key</th>
            <th>Size (Bytes)</th>
            <th>URL</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.key}>
              <td>{file.name}</td>
              <td>{file.key}</td>
              <td>{file.size ?? 'Unknown'}</td>
              <td>
                {file.url ? (
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                ) : (
                  'Unavailable'
                )}
              </td>
              <td>
                <button onClick={() => deleteFile(file.key)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
