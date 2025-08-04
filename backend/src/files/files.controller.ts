import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { FilesService } from "./files.service";
import { OptionalUser, User } from "@/common/decorators/user.decorator";
import { User as UserType } from "@/core/db/schema";
import { AuthGuard } from "@/auth/auth.guard";
import { AccessGuard } from "@/accessmgt/accessmgt.guard";
import { BypassRole } from "@/accessmgt/bypassroles.decorator";
import { Permissions } from "@/accessmgt/permissions.decorator";
import { Message } from "@/common/dto/message";

@ApiTags("Files")
@Controller("files")
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @ApiOperation({
    summary: "Get all files",
    description: "Retrieve a paginated list of all files in the system",
  })
  @ApiQuery({
    name: "limit",
    description: "Maximum number of files to return (max 100)",
    required: false,
    type: "number",
    example: 20,
  })
  @ApiQuery({
    name: "offset",
    description: "Number of files to skip for pagination",
    required: false,
    type: "number",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved files",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          name: { type: "string" },
          fileType: { type: "string" },
          size: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing authentication token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "No files found",
  })
  @Permissions([{ resource: "file", action: "r" }])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getFiles(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    return this.filesService.getFiles({
      limit: limit || 20,
      offset: offset || 0,
    });
  }

  @Get(":id/info")
  @ApiOperation({
    summary: "Get file information",
    description: "Retrieve metadata and information about a specific file",
  })
  @ApiParam({
    name: "id",
    description: "The unique identifier of the file",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved file information",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        name: { type: "string" },
        fileType: { type: "string" },
        size: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing authentication token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "File not found",
  })
  @Permissions([{ resource: "file", action: "r" }])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async getFileInfo(@Param("id") id: string) {
    return this.filesService.getFileInfo(id);
  }

  @Get(":id/download")
  @ApiOperation({
    summary: "Download file",
    description: "Download a file by its unique identifier",
  })
  @ApiParam({
    name: "id",
    description: "The unique identifier of the file to download",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "File downloaded successfully",
    content: {
      "application/octet-stream": {
        schema: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing authentication token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "File not found",
  })
  @UseGuards(AuthGuard)
  async downloadFile(
    @Param("id") id: string,
    @Res({ passthrough: true }) res: Response,
    @OptionalUser() optionalUser?: UserType,
  ) {
    const fileStream = await this.filesService.getFileStream({
      id,
      optionalUser,
    });
    const fileInfo = await this.filesService.getFileInfo(id);

    res.set({
      "Content-Type": fileInfo.fileType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileInfo.name}"`,
    });

    return fileStream;
  }

  @Post("upload")
  @ApiOperation({
    summary: "Upload single file",
    description: "Upload a single file to the system",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "File upload",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "The file to upload",
        },
        name: {
          type: "string",
          description: "Optional custom name for the file",
        },
      },
      required: ["file"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "File uploaded successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "File uploaded successfully",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid file or data",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing authentication token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(AuthGuard)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserType,
    @Query("name") name?: string,
    @Query("protected") isProtected?: boolean,
  ): Promise<Message> {
    return this.filesService.uploadFile({
      file,
      name: name || null,
      user: user,
      protected: isProtected,
    });
  }

  @Post("upload-multiple")
  @ApiOperation({
    summary: "Upload multiple files",
    description: "Upload multiple files to the system at once",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Multiple file upload",
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          description: "The files to upload",
        },
      },
      required: ["files"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Files uploaded successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Files uploaded successfully",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid files or data",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing authentication token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @UseInterceptors(FilesInterceptor("files"))
  @Permissions([{ resource: "file", action: "rw" }])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: UserType,
    @Query("protected") isProtected?: boolean,
  ): Promise<Message> {
    return this.filesService.uploadFiles({ files, user, protected: isProtected });
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete file",
    description: "Permanently delete a file from the system",
  })
  @ApiParam({
    name: "id",
    description: "The unique identifier of the file to delete",
    type: "string",
  })
  @ApiResponse({
    status: 204,
    description: "File deleted successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing authentication token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "File not found",
  })
  @Permissions([{ resource: "file", action: "rw", resourceParamName: "id" }])
  @BypassRole({ roleName: "admin" })
  @UseGuards(AuthGuard, AccessGuard)
  async deleteFile(@Param("id") id: string): Promise<void> {
    await this.filesService.deleteFile(id);
  }
}
