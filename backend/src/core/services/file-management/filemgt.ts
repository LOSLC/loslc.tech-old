import { getEnv } from "@/core/env";
import {
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { createReadStream, ReadStream } from "node:fs";
import { access, unlink, writeFile } from "node:fs/promises";
import { constants } from "node:fs/promises";

interface FileManagerConfig {
  storagePath: string;
}

interface FileUploadOptions {
  file: Express.Multer.File;
  id: string;
}

export class FileManager {
  private config: FileManagerConfig = {
    storagePath: getEnv("STORAGE"),
  };

  private async fileExists(id: string): Promise<boolean> {
    try {
      await access(
        `${process.cwd()}/${this.config.storagePath}/${id}`,
        constants.F_OK,
      );
      return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async uploadFile({ file, id }: { file: Express.Multer.File; id: string }) {
    if (await this.fileExists(id)) {
      throw new ConflictException("This file already exists");
    }
    
    try {
      await writeFile(
        `${process.cwd()}/${this.config.storagePath}/${id}`,
        file.buffer,
      );
    } catch (error) {
      console.error("Error writing file:", error);
      throw new InternalServerErrorException("Failed to upload file");
    }
  }

  async uploadFiles(files: FileUploadOptions[]) {
    for (const file of files) {
      try {
        await this.uploadFile(file);
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new InternalServerErrorException("Failed to upload files");
      }
    }
  }

  async getFile(id: string): Promise<ReadStream> {
    if (!(await this.fileExists(id))) {
      throw new ConflictException("This file does not exist");
    }
    return createReadStream(
      `${process.cwd()}/${this.config.storagePath}/${id}`,
    );
  }

  async deleteFile(id: string): Promise<void> {
    if (!(await this.fileExists(id))) {
      throw new ConflictException("This file does not exist");
    }
    try {
      await access(
        `${process.cwd()}/${this.config.storagePath}/${id}`,
        constants.F_OK,
      );
      await unlink(`${process.cwd()}/${this.config.storagePath}/${id}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new InternalServerErrorException("Failed to delete file");
    }
  }
}
