import { Profile, User } from "../../prisma/client";

export type RequestWithUser = {
  user: User;
} & Request;
export type AuthenticatedUser = User & { profile?: Profile };

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
