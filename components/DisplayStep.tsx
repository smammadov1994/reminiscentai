import React from "react";
import { Spinner } from "./Spinner";
import type { GeneratedImageState } from "../App";
import { RecreateIcon } from "./icons/RecreateIcon";
import { HeartIcon } from "./icons/HeartIcon";

interface ArtifactCardProps {
  imageData: GeneratedImageState;
  isFavorited: boolean;
  onRecreate: () => void;
  onFavorite: () => void;
  onImageClick?: () => void;
}

const ArtifactCard: React.FC<ArtifactCardProps> = ({
  imageData,
  isFavorited,
  onRecreate,
  onFavorite,
  onImageClick,
}) => {
  return (
    <div className="flex flex-col gap-3 group">
      <div className="relative aspect-square overflow-hidden border-6 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
        {imageData === null && (
          <div className="w-full h-full bg-blue-400 flex items-center justify-center animate-pulse">
            <div className="text-4xl animate-bounce">⏳</div>
          </div>
        )}
        {imageData === "error" && (
          <div className="w-full h-full bg-red-400 text-black flex flex-col items-center justify-center text-center p-4 border-4 border-black">
            <div className="text-4xl mb-2">💥</div>
            <p className="text-lg font-black bg-white px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              OOPS! FAILED!
            </p>
          </div>
        )}
        {typeof imageData === "string" && (
          <img
            src={imageData}
            alt="AI Generated Artifact"
            className="w-[90%] h-[90%] object-contain mx-auto my-auto cursor-pointer hover:scale-105 transition-transform"
            onClick={onImageClick}
          />
        )}
      </div>
      {typeof imageData === "string" && (
        <div className="flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3">
          <button
            onClick={onRecreate}
            title="Recreate this image"
            className="p-3 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-12 hover:rotate-0"
          >
            <RecreateIcon className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={onFavorite}
            title="Favorite this image"
            className="p-3 bg-pink-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform -rotate-12 hover:rotate-0"
          >
            <HeartIcon className="w-5 h-5" isFavorited={isFavorited} />
          </button>
        </div>
      )}
    </div>
  );
};

interface DisplayStepProps {
  generatedImages: GeneratedImageState[];
  isGenerating: boolean;
  favoritedIndex: number | null;
  onFavoriteChange: (index: number | null) => void;
  onRecreateSingle: (index: number) => void;
  onImageClick?: () => void;
}

export const DisplayStep: React.FC<DisplayStepProps> = ({
  generatedImages,
  isGenerating,
  favoritedIndex,
  onFavoriteChange,
  onRecreateSingle,
  onImageClick,
}) => {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-black mb-4 transform -rotate-1">
          <span className="bg-pink-400 px-6 py-3 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
            🎨 GENERATED ARTIFACTS!
          </span>
        </h2>
        <p className="text-black font-bold text-lg bg-yellow-400 p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1 max-w-2xl mx-auto">
          Here are your creative variations! Click on any image to unlock them!
          🔓✨
        </p>
      </div>
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-6">
        {generatedImages.map((img, index) => (
          <ArtifactCard
            key={index}
            imageData={img}
            isFavorited={favoritedIndex === index}
            onRecreate={() => onRecreateSingle(index)}
            onFavorite={() =>
              onFavoriteChange(favoritedIndex === index ? null : index)
            }
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
};
