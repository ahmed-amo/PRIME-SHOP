"use client";
import React, { useState } from "react";

// Shared types
type ImageFile = {
  id: string;
  file: File;
  preview: string;
};

type FileInputProps = {
  multiple?: boolean;
  maxSizeMB?: number;
  onChange?: (files: File[]) => void;
  acceptedFileTypes?: string;
};

// Compact File Input Component
export const CompactFileInput: React.FC<FileInputProps> = ({
  multiple = false,
  maxSizeMB = 1,
  onChange,
  acceptedFileTypes = "image/*",
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Reset error
    setError(null);

    // Validate file size
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxSizeBytes
    );
    if (oversizedFiles.length > 0) {
      setError(`File(s) exceed the ${maxSizeMB}MB limit`);
      return;
    }

    // Handle single file mode
    if (!multiple && selectedFiles.length > 0) {
      // Remove previous image and URL
      images.forEach((img) => URL.revokeObjectURL(img.preview));

      const file = selectedFiles[0];
      const newImage = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      };

      setImages([newImage]);
      onChange?.([file]);
      return;
    }

    // Handle multiple files
    const newImages = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    onChange?.(selectedFiles);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updatedImages = prev.filter((img) => {
        if (img.id === id) {
          URL.revokeObjectURL(img.preview);
          return false;
        }
        return true;
      });

      // Notify parent component
      onChange?.(updatedImages.map((img) => img.file));

      return updatedImages;
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="compact-file-input">
      <div className="input-container flex items-center gap-2 p-2 border rounded border-gray-300">
        <button
          type="button"
          onClick={handleBrowseClick}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Browse
        </button>
        <span className="text-sm text-gray-500">
          {multiple ? "Choose images" : "Choose an image"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}

      {images.length > 0 && (
        <div className="image-previews mt-2 flex flex-wrap gap-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="preview-container relative w-16 h-16 border rounded overflow-hidden"
            >
              <img
                src={img.preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Dropzone File Input Component
export const DropzoneFileInput: React.FC<FileInputProps> = ({
  multiple = false,
  maxSizeMB = 1,
  onChange,
  acceptedFileTypes = "image/*",
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleFiles = React.useCallback(
    (files: File[]) => {
      // Reset error
      setError(null);

      // Validate file size
      const oversizedFiles = files.filter((file) => file.size > maxSizeBytes);
      if (oversizedFiles.length > 0) {
        setError(`File(s) exceed the ${maxSizeMB}MB limit`);
        return;
      }

      // Handle single file mode
      if (!multiple && files.length > 0) {
        // Remove previous images and URLs
        images.forEach((img) => URL.revokeObjectURL(img.preview));

        const file = files[0];
        const newImage = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
        };

        setImages([newImage]);
        onChange?.([file]);
        return;
      }

      // Handle multiple files
      const newImages = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }));

      setImages((prev) => [...prev, ...newImages]);
      onChange?.(files);
    },
    [images, maxSizeBytes, multiple, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const updatedImages = prev.filter((img) => {
        if (img.id === id) {
          URL.revokeObjectURL(img.preview);
          return false;
        }
        return true;
      });

      // Notify parent component
      onChange?.(updatedImages.map((img) => img.file));

      return updatedImages;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const imageFiles = droppedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        setError("Please drop image files only");
        return;
      }

      handleFiles(imageFiles);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="dropzone-file-input">
      <div
        className={`dropzone p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <div className="icon mb-4 text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium mb-1">
            Drag & Drop {multiple ? "Images" : "an Image"} Here
          </p>
          <p className="text-sm text-gray-500 mb-2">or</p>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Browse Files
          </button>
          <p className="text-xs text-gray-400 mt-2">Max size: {maxSizeMB}MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {images.length > 0 && (
        <div className="image-previews mt-4">
          <h3 className="text-sm font-medium mb-2">
            {images.length} {images.length === 1 ? "Image" : "Images"} Selected
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="preview-item relative rounded-lg overflow-hidden border"
              >
                <div className="aspect-square">
                  <img
                    src={img.preview}
                    alt={img.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 bg-white text-xs truncate">
                  {img.file.name}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Demo component
const ImageUploadOne = () => {
  const [files1, setFiles1] = useState<File[]>([]);
  const [files2, setFiles2] = useState<File[]>([]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Image Upload Components</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">1. Compact File Input</h2>
        <div className="p-4 border rounded">
          <CompactFileInput
            multiple={true}
            maxSizeMB={1}
            onChange={setFiles1}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">2. Dropzone File Input</h2>
        <div className="p-4 border rounded">
          <DropzoneFileInput
            multiple={true}
            maxSizeMB={1}
            onChange={setFiles2}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploadOne;
