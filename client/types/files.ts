// Note: key and name are the same. This is an artefact of a previous AWS implementation
interface FileMetadata {
  name: string;
  key: string;
  size?: number;
  url?: string;
}

export type { FileMetadata };
