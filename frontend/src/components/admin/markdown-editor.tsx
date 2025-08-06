"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onFileUpload?: (file: File) => Promise<string>; // Returns URL of uploaded file
  height?: number;
}

interface UploadedFile {
  file: File;
  url: string;
  uploading: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Start writing your content...",
  className,
  onFileUpload,
  height = 400,
}: MarkdownEditorProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onFileUpload || !e.target.files) return;

    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const uploadedFile: UploadedFile = {
        file,
        url: "",
        uploading: true,
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);

      try {
        const url = await onFileUpload(file);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === file 
              ? { ...f, url, uploading: false }
              : f
          )
        );

        // Insert appropriate markdown based on file type
        const markdownText = file.type.startsWith("image/") 
          ? `![${file.name}](${url})\n`
          : `[${file.name}](${url})\n`;
        
        onChange(value + markdownText);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadedFiles(prev => prev.filter(f => f.file !== file));
      }
    }

    // Reset input
    e.target.value = "";
  };

  const removeUploadedFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles(prev => prev.filter(f => f !== fileToRemove));
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!onFileUpload) return;

    const files = Array.from(e.dataTransfer.files);
    
    for (const file of files) {
      if (file.type.startsWith("image/") || file.type.startsWith("application/")) {
        const uploadedFile: UploadedFile = {
          file,
          url: "",
          uploading: true,
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);

        try {
          const url = await onFileUpload(file);
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === file 
                ? { ...f, url, uploading: false }
                : f
            )
          );

          // Insert markdown
          const markdownText = file.type.startsWith("image/") 
            ? `![${file.name}](${url})\n`
            : `[${file.name}](${url})\n`;
          
          onChange(value + markdownText);
        } catch (error) {
          console.error("Upload failed:", error);
          setUploadedFiles(prev => prev.filter(f => f.file !== file));
        }
      }
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Markdown Editor</CardTitle>
          {onFileUpload && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
        >
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || "")}
            height={height}
            data-color-mode="light"
            visibleDragbar={false}
            textareaProps={{
              placeholder,
              style: {
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily: '"Fira code", "Fira Mono", Consolas, Menlo, Courier, monospace',
              },
            }}
          />
        </div>

        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((uploadedFile, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-2">
                  {uploadedFile.uploading ? (
                    <span className="text-xs">Uploading...</span>
                  ) : (
                    <>
                      <span className="text-xs">{uploadedFile.file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadedFile(uploadedFile)}
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,application/pdf,.doc,.docx,.txt,.md"
        />
      </CardContent>
    </Card>
  );
}

export default MarkdownEditor;
