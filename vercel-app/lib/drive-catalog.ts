import "server-only";

export type FileEntry = { id: string; name: string; mimeType: string; url: string; parent: string };
export type FolderEntry = { id: string; name: string; url: string };
export type DriveCatalog = { updatedAt: string; folderUrl: string; folders: FolderEntry[]; files: FileEntry[] };

const validId = (value: unknown): value is string => typeof value === "string" && /^[\w-]+$/.test(value);
function validUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["drive.google.com", "docs.google.com"].includes(url.hostname);
  } catch { return false; }
}
function validFile(value: unknown): value is FileEntry {
  if (!value || typeof value !== "object") return false;
  const file = value as Record<string, unknown>;
  return validId(file.id) && typeof file.name === "string" && typeof file.mimeType === "string" && validUrl(file.url) && validId(file.parent);
}
function validFolder(value: unknown): value is FolderEntry {
  if (!value || typeof value !== "object") return false;
  const folder = value as Record<string, unknown>;
  return validId(folder.id) && typeof folder.name === "string" && validUrl(folder.url);
}

/** Private service configuration; never store institutional file metadata in the public repository. */
export function getDriveCatalog(): DriveCatalog | null {
  try {
    const raw: unknown = JSON.parse(process.env.BIBLIOTECA_DRIVE_CATALOG || "null");
    if (!raw || typeof raw !== "object") return null;
    const index = raw as Record<string, unknown>;
    if (typeof index.updatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(index.updatedAt) || !validUrl(index.folderUrl)
      || !Array.isArray(index.files) || !index.files.every(validFile)
      || !Array.isArray(index.folders) || !index.folders.every(validFolder)) return null;
    return { updatedAt: index.updatedAt, folderUrl: index.folderUrl, files: index.files, folders: index.folders };
  } catch { return null; }
}
