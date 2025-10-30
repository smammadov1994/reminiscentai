import React, { useRef, useState, useCallback } from "react";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEvents = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isLoading) {
        setIsDragging(dragging);
      }
    },
    [isLoading]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (isLoading) return;

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onImageUpload(file);
      }
    },
    [isLoading, onImageUpload]
  );

  return (
    <div
      onClick={handleClick}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center p-12 border-6 border-black cursor-pointer transition-all duration-300 transform ${
        isDragging
          ? "bg-pink-400 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-2 scale-105"
          : "bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] rotate-1 hover:rotate-0"
      } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={isLoading}
      />
      <div className="text-6xl mb-6 animate-bounce">📸</div>
      <p className="text-black text-center font-black text-xl">
        <span className="bg-yellow-400 px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">
          CLICK TO UPLOAD!
        </span>
      </p>
      <p className="text-black font-bold mt-4 bg-green-400 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
        or drag and drop! 🎯
      </p>
      <p className="text-black font-bold text-sm mt-4 bg-blue-400 px-3 py-1 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
        PNG, JPG, or WEBP ✨
      </p>
    </div>
  );
};
