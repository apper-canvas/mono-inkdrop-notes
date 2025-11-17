import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FileUploadZone = ({ 
  onFileUpload, 
  acceptedTypes = "image/*,.pdf,.doc,.docx,.txt",
  maxSize = 10485760, // 10MB
  className = "",
  multiple = true
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = async (files) => {
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} is too large`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const uploadedFiles = validFiles.map(file => ({
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      }));

      onFileUpload && onFileUpload(uploadedFiles);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
        isDragOver 
          ? "border-amber-500 bg-amber-50 scale-105" 
          : "border-stone-300 hover:border-amber-400 hover:bg-stone-50",
        uploading && "opacity-75 cursor-not-allowed",
        className
      )}
    >
      <input
        type="file"
        accept={acceptedTypes}
        multiple={multiple}
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
      />
      
      <div className="space-y-4">
        <div className={cn(
          "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-200",
          isDragOver 
            ? "bg-amber-200" 
            : "bg-stone-100"
        )}>
          {uploading ? (
            <ApperIcon name="Loader2" size={32} className="text-amber-600 animate-spin" />
          ) : (
            <ApperIcon name="Upload" size={32} className="text-stone-600" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-medium text-stone-800 mb-2">
            {uploading ? "Uploading files..." : "Drop files here or click to upload"}
          </p>
          <p className="text-sm text-stone-500">
            Supports images, PDFs, and documents up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;