import { AccessmgtService } from "@/accessmgt/accessmgt.service";
import { checkConditions } from "@/common/checkers/utils";
import { Message } from "@/common/dto/message";
import { db } from "@/core/db/db";
import {
  permissionsTable,
  rolePermissionsTable,
  rolesTable,
  User,
  userRolesTable,
} from "@/core/db/schema";
import { File, filesTable } from "@/core/db/schemas/resources/file";
import { FileManager } from "@/core/services/file-management/filemgt";
import {
  Injectable,
  InternalServerErrorException,
  StreamableFile,
  UnauthorizedException,
} from "@nestjs/common";
import { eq } from "drizzle-orm";

@Injectable()
export class FilesService {
  constructor(private accessmgtService: AccessmgtService) {}
  async getFileInfo(id: string) {
    const [file] = await db
      .select()
      .from(filesTable)
      .where(eq(filesTable.id, id))
      .limit(1);
    if (!file) {
      throw new Error("File not found");
    }
    return file;
  }

  async getFileStream({
    id,
    optionalUser,
  }: { id: string; optionalUser?: User }) {
    const file = await this.getFileInfo(id);
    if (file.protected) {
      if (!optionalUser) {
        throw new UnauthorizedException("Unauthorized to access this resource");
      }
      await this.accessmgtService.checkPermissions({
        permissions: [
          {
            action: "rw",
            resource: "file",
            resourceId: id,
          },
          {
            action: "r",
            resource: "file",
            resourceId: id,
          },
          {
            action: "rw",
            resource: "file",
          },
          {
            action: "r",
            resource: "file",
          },
        ],
        user: optionalUser,
        either: true,
      });
    }
    const fm = new FileManager();
    return new StreamableFile(await fm.getFile(id));
  }

  async uploadFile({
    file,
    name,
    user,
    protected: isProtected = false,
  }: {
    file: Express.Multer.File;
    name?: string | null; // query param
    user: User;
    protected?: boolean;
  }) {
    const fm = new FileManager();
    const [dbFile] = await db
      .insert(filesTable)
      .values({
        userId: user.id,
        name: name ?? file.originalname,
        fileType: file.mimetype,
        size: file.size,
        protected: isProtected,
      })
      .returning();
    const [fileMgtRole] = await db
      .insert(rolesTable)
      .values({
        name: `${user.username} rw file-mgt ${dbFile.id}`,
      })
      .returning();

    const [fileRwPermission] = await db
      .insert(permissionsTable)
      .values({
        action: "rw",
        resource: "file",
        resourceId: dbFile.id,
      })
      .returning();

    await db.insert(userRolesTable).values({
      userId: user.id,
      roleId: fileMgtRole.id,
    });

    await db
      .insert(rolePermissionsTable)
      .values({ roleId: fileMgtRole.id, permissionId: fileRwPermission.id });

    // Now that database record is created, write the actual file to filesystem
    try {
      await fm.uploadFile({ file: file, id: dbFile.id });
    } catch (error) {
      // If file write fails, we should clean up the database record
      console.error("Error uploading file to filesystem:", error);
      
      // Clean up database records on file write failure
      try {
        await db.delete(rolePermissionsTable).where(eq(rolePermissionsTable.roleId, fileMgtRole.id));
        await db.delete(userRolesTable).where(eq(userRolesTable.roleId, fileMgtRole.id));
        await db.delete(permissionsTable).where(eq(permissionsTable.id, fileRwPermission.id));
        await db.delete(rolesTable).where(eq(rolesTable.id, fileMgtRole.id));
        await db.delete(filesTable).where(eq(filesTable.id, dbFile.id));
      } catch (cleanupError) {
        console.error("Error cleaning up database records:", cleanupError);
      }
      
      throw new InternalServerErrorException("Failed to upload file");
    }
    const response: Message = {
      message: "File uploaded successfully",
    };
    return response;
  }

  async uploadFiles({
    files,
    user,
    protected: isProtected = false,
  }: { user: User; files: Express.Multer.File[]; protected?: boolean }) {
    const fm = new FileManager();
    const filesToUpload = files.map(async (file) => {
      const [dbFile] = await db
        .insert(filesTable)
        .values({
          userId: user.id,
          name: file.originalname,
          fileType: file.mimetype,
          size: file.size,
          protected: isProtected,
        })
        .returning();
      const [fileMgtRole] = await db
        .insert(rolesTable)
        .values({
          name: `${user.username} rw file-mgt ${dbFile.id}`,
        })
        .returning();

      const [fileRwPermission] = await db
        .insert(permissionsTable)
        .values({
          action: "rw",
          resource: "file",
          resourceId: dbFile.id,
        })
        .returning();

      await db.insert(userRolesTable).values({
        userId: user.id,
        roleId: fileMgtRole.id,
      });

      await db
        .insert(rolePermissionsTable)
        .values({ roleId: fileMgtRole.id, permissionId: fileRwPermission.id });
      return { file: file, id: dbFile.id };
    });
    
    // Wait for all database records to be created first
    const fileUploadData = await Promise.all(filesToUpload);
    
    // Now write all files to filesystem
    try {
      await fm.uploadFiles(fileUploadData);
    } catch (error) {
      // If any file write fails, we should clean up all database records
      console.error("Error uploading files to filesystem:", error);
      
      // Clean up database records on file write failure
      for (const { id } of fileUploadData) {
        try {
          const [file] = await db.select().from(filesTable).where(eq(filesTable.id, id)).limit(1);
          if (file) {
            // Delete associated permissions and roles
            const roles = await db.select().from(rolesTable).where(eq(rolesTable.name, `${user.username} rw file-mgt ${id}`));
            for (const role of roles) {
              await db.delete(rolePermissionsTable).where(eq(rolePermissionsTable.roleId, role.id));
              await db.delete(userRolesTable).where(eq(userRolesTable.roleId, role.id));
              await db.delete(permissionsTable).where(eq(permissionsTable.resourceId, id));
              await db.delete(rolesTable).where(eq(rolesTable.id, role.id));
            }
            await db.delete(filesTable).where(eq(filesTable.id, id));
          }
        } catch (cleanupError) {
          console.error(`Error cleaning up database record for file ${id}:`, cleanupError);
        }
      }
      
      throw new InternalServerErrorException("Failed to upload files");
    }

    const response: Message = {
      message: "Files uploaded successfully",
    };
    return response;
  }

  async deleteFile(id: string) {
    const [file] = await db
      .select()
      .from(filesTable)
      .where(eq(filesTable.id, id))
      .limit(1);

    checkConditions({
      conditions: [!!file],
      statusCode: 404,
      message: "File not found",
    });

    const fm = new FileManager();
    await fm.deleteFile(id);
  }

  async getFiles({
    limit = 20,
    offset = 0,
  }: { limit: number; offset: number }): Promise<File[]> {
    const files = await db
      .select()
      .from(filesTable)
      .offset(offset)
      .limit(limit);

    checkConditions({
      conditions: [files.length > 0],
      statusCode: 404,
      message: "No files found",
    });
    return files;
  }
}
