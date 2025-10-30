import React from "react";
import { ImageUploader } from "./ImageUploader";

interface UploadStepProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export const UploadStep: React.FC<UploadStepProps> = ({
  onImageUpload,
  isLoading,
}) => {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 transform -rotate-2">
        <span className="bg-white text-black px-6 py-4 border-6 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] inline-block">
          🚀 REACTIVATE YOUR IMAGE!
        </span>
      </h1>
      <p className="mt-4 text-xl font-bold text-black max-w-xl mb-12 bg-yellow-400 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
        Upload your brand logo or any image! 📸 The AI will create emotional
        variations based on user inactivity. It's like giving your logo
        FEELINGS! 🎭
      </p>
      <div className="w-full">
        <ImageUploader onImageUpload={onImageUpload} isLoading={isLoading} />
      </div>
    </div>
  );
};
