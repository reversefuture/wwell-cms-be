export interface UploadedFileMetadata {
    filename: string;
    encoding: string;
    mimeType: string;
    buffer?: Buffer;
    size?: string;
    storageUrl?: string;
}
export interface JSONResponse {
    message: string;
    data?: unknown;
}

