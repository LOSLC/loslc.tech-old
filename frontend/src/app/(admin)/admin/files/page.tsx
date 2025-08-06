"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  File,
  FileText,
  Image as ImageIcon,
  Video,
  HardDrive,
  Upload,
  Download,
  Trash2,
  Eye,
  Search,
  Calendar,
  Shield,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminApi, type FileInfo } from "@/lib/api/admin";
import userApi, { type UserDTO } from "@/lib/api/users";
import { toast } from "sonner";
import Image from "next/image";

interface FileWithUser extends FileInfo {
  uploader?: UserDTO;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(fileType: string | undefined) {
  if (!fileType) return File;
  if (fileType.startsWith("image/")) return ImageIcon;
  if (fileType.startsWith("video/")) return Video;
  if (fileType === "application/pdf" || fileType.includes("document"))
    return FileText;
  return File;
}

function getFileTypeColor(fileType: string | undefined): string {
  if (!fileType) return "text-gray-600";
  if (fileType.startsWith("image/")) return "text-green-600";
  if (fileType.startsWith("video/")) return "text-blue-600";
  if (fileType === "application/pdf" || fileType.includes("document"))
    return "text-red-600";
  return "text-gray-600";
}

function FileCard({
  file,
  onDelete,
  onView,
}: {
  file: FileWithUser;
  onDelete: (file: FileWithUser) => void;
  onView: (file: FileWithUser) => void;
}) {
  const FileIcon = getFileIcon(file.fileType);
  const iconColor = getFileTypeColor(file.fileType);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={cn("p-2 rounded-lg bg-gray-50", iconColor)}>
            <FileIcon className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="font-medium text-sm truncate"
              title={file.name || "Unknown file"}
            >
              {file.name || "Unknown file"}
            </h3>

            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {formatFileSize(file.size || 0)}
              </Badge>
              {file.protected && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Protected
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-1 mt-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {file.createdAt
                  ? new Date(file.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Uploader:{" "}
              {file.uploader
                ? file.uploader.fullName
                : file.userId || "Unknown"}
            </p>
          </div>

          <div className="flex flex-col space-y-1">
            <Button variant="ghost" size="sm" onClick={() => onView(file)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a
                href={`/api/files/${file.id}/download`}
                download={file.name || "download"}
              >
                <Download className="h-3 w-3" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(file)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FileUploadDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [isProtected, setIsProtected] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (data: { files: File[]; isProtected: boolean }) =>
      adminApi.files.uploadMultiple(data.files, data.isProtected),
    onSuccess: () => {
      toast.success("Files uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "files"] });
      onOpenChange(false);
      setFiles([]);
      setIsProtected(false);
    },
    onError: (error) => {
      toast.error(`Failed to upload files: ${error.message}`);
    },
  });

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    uploadMutation.mutate({ files, isProtected });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors",
              isDragOver && "border-blue-500 bg-blue-50",
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or click to browse
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              Browse Files
            </Button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Files</h4>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {formatFileSize(file.size)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploadMutation.isPending}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Options */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="protected"
              checked={isProtected}
              onChange={(e) => setIsProtected(e.target.checked)}
              disabled={uploadMutation.isPending}
            />
            <label htmlFor="protected" className="text-sm">
              Make files protected (admin access only)
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploadMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploadMutation.isPending}
          >
            {uploadMutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </DialogContent>
    </Dialog>
  );
}

function FileViewDialog({
  file,
  open,
  onOpenChange,
}: {
  file: FileWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!file) return null;

  const FileIcon = getFileIcon(file.fileType);
  const iconColor = getFileTypeColor(file.fileType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>File Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-4">
            <div className={cn("p-3 rounded-lg bg-gray-50", iconColor)}>
              <FileIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-medium">{file.name || "Unknown file"}</h3>
              <p className="text-sm text-muted-foreground">
                {file.fileType || "Unknown type"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">
                File Size
              </label>
              <p>{formatFileSize(file.size || 0)}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">
                File Type
              </label>
              <p>{file.fileType || "Unknown"}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">
                Uploaded By
              </label>
              <p>
                {file.uploader
                  ? file.uploader.fullName
                  : file.userId || "Unknown"}
              </p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">
                Upload Date
              </label>
              <p>
                {file.createdAt
                  ? new Date(file.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">
                Protection
              </label>
              <p>{file.protected ? "Protected" : "Public"}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">
                File ID
              </label>
              <p className="font-mono text-xs">{file.id}</p>
            </div>
          </div>

          {/* Preview for images */}
          {file.fileType && file.fileType.startsWith("image/") && (
            <div className="mt-4">
              <label className="font-medium text-muted-foreground mb-2 block">
                Preview
              </label>
              <Image
                height={200}
                width={200}
                src={`/api/files/${file.id}/download`}
                alt={file.name || "Image preview"}
                className="max-w-full h-auto rounded border"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" asChild>
            <a
              href={`/api/files/${file.id}/download`}
              download={file.name || "download"}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function FileManagementPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<FileWithUser | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Fetch files
  const {
    data: files = [],
    isLoading: filesLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "files"],
    queryFn: () => adminApi.files.getAll(100, 0), // Get more files for admin
  });

  // Fetch users for each file
  const { data: filesWithUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "files-with-users", files.map((f) => f.userId)],
    queryFn: async (): Promise<FileWithUser[]> => {
      const filesWithUserPromises = files.map(async (file) => {
        try {
          const uploader = await userApi.getUserById(file.userId);
          return { ...file, uploader };
        } catch {
          return { ...file, uploader: undefined };
        }
      });
      return Promise.all(filesWithUserPromises);
    },
    enabled: files.length > 0,
  });

  const isLoading = filesLoading || usersLoading;

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: (id: string) => adminApi.files.delete(id),
    onSuccess: () => {
      toast.success("File deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "files"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete file: ${error.message}`);
    },
  });

  const filteredFiles = filesWithUsers.filter(
    (file) =>
      (file.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.fileType || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalSize = filesWithUsers.reduce(
    (sum, file) => sum + (file.size || 0),
    0,
  );
  const imageFiles = filesWithUsers.filter(
    (f) => f.fileType && f.fileType.startsWith("image/"),
  );
  const protectedFiles = filesWithUsers.filter((f) => f.protected === true);

  const handleDeleteFile = (file: FileWithUser) => {
    const fileName = file.name || "this file";
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      deleteFileMutation.mutate(file.id);
    }
  };

  const handleViewFile = (file: FileWithUser) => {
    setViewingFile(file);
    setViewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-destructive">
            Error loading files: {error.message}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">File Management</h1>
            <p className="text-muted-foreground">
              Upload, organize, and manage media files and documents.
            </p>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>

        {/* File Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">
                    {filesWithUsers.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">
                    {formatFileSize(totalSize)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{imageFiles.length}</div>
              <p className="text-xs text-muted-foreground">Images</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{protectedFiles.length}</div>
              <p className="text-xs text-muted-foreground">Protected Files</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={handleDeleteFile}
              onView={handleViewFile}
            />
          ))}
        </div>

        {filteredFiles.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {filesWithUsers.length === 0
                  ? "No files uploaded yet. Upload some to get started."
                  : "No files found matching your search."}
              </p>
            </CardContent>
          </Card>
        )}

        <FileUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
        />

        <FileViewDialog
          file={viewingFile}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      </div>
    </AdminLayout>
  );
}
