import ky from 'ky';
import { resolveRequest } from './request';

export interface FileInfoDTO {
  id: string;
  userId: string;
  name: string;
  fileType: string;
  size: number;
  createdAt: string;
}

export const filesApi = {
  uploadSingle: async (file: File, options?: { name?: string; protected?: boolean }) => {
    const formData = new FormData();
    formData.append('file', file);
    const searchParams = new URLSearchParams();
    if (options?.name) searchParams.append('name', options.name);
    if (options?.protected !== undefined) searchParams.append('protected', String(options.protected));

    const uploadClient = ky.create({
      prefixUrl: '/api',
      timeout: 30000,
      credentials: 'include',
    });
    const promise = uploadClient.post('files/upload', { body: formData, searchParams }).json<FileInfoDTO>();
    const [response, error] = await resolveRequest(promise);
    if (error) throw new Error(error.message);
    return response;
  },

  getInfo: async (id: string): Promise<FileInfoDTO> => {
    const uploadClient = ky.create({
      prefixUrl: '/api',
      timeout: 30000,
      credentials: 'include',
    });
    const promise = uploadClient.get(`files/${id}/info`).json<FileInfoDTO>();
    const [response, error] = await resolveRequest(promise);
    if (error) throw new Error(error.message);
    return response as FileInfoDTO;
  },

  downloadUrl: (id: string) => `/api/files/${id}/download`,
};
