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
  onEmailSend?: () => void;
}

const ArtifactCard: React.FC<ArtifactCardProps> = ({
  imageData,
  isFavorited,
  onRecreate,
  onFavorite,
  onImageClick,
  onEmailSend,
}) => {
  return (
    <div className="flex flex-col gap-3 group pt-4">
      {/* Action Buttons - Above Image */}
      {typeof imageData === "string" && (
        <div
          className={`flex items-center justify-center gap-3 transition-opacity duration-300 ${
            onEmailSend ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="relative group/tooltip">
            <button
              onClick={onRecreate}
              className="p-3 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-12 hover:rotate-0"
            >
              <RecreateIcon className="w-5 h-5 text-black" />
            </button>
            {/* Custom Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm font-bold rounded-lg border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
              🔄 Recreate this image with AI magic!
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </div>
          <div className="relative group/tooltip">
            <button
              onClick={onFavorite}
              className="p-3 bg-pink-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform -rotate-12 hover:rotate-0"
            >
              <HeartIcon className="w-5 h-5" isFavorited={isFavorited} />
            </button>
            {/* Custom Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm font-bold rounded-lg border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
              {isFavorited ? "💔 Remove from favorites" : "❤️ Add to favorites"}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </div>
          {onEmailSend && (
            <div className="relative group/tooltip">
              <button
                onClick={onEmailSend}
                className="p-3 bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-6 hover:rotate-0"
              >
                <span className="text-black font-black text-lg">📧</span>
              </button>
              {/* Custom Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm font-bold rounded-lg border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                📧 Send this awesome logo via email!
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Container - Slightly Smaller */}
      <div
        className={`relative aspect-[4/3] overflow-hidden border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all ${
          typeof imageData === "string" ? "bg-gray-100" : "bg-white"
        }`}
      >
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
            className={`w-[90%] h-[80%] object-contain mx-auto mt-8 mb-auto transition-transform ${
              onImageClick ? "cursor-pointer hover:scale-105" : "cursor-default"
            }`}
            onClick={onImageClick}
          />
        )}
      </div>
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
  onEmailSend?: (imageUrl: string, index: number) => void;
}

export const DisplayStep: React.FC<DisplayStepProps> = ({
  generatedImages,
  isGenerating,
  favoritedIndex,
  onFavoriteChange,
  onRecreateSingle,
  onImageClick,
  onEmailSend,
}) => {
  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-black mb-4 transform -rotate-1">
          <span className="bg-pink-400 px-6 py-3 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
            🎨 GENERATED ARTIFACTS!
          </span>
        </h2>
        <p className="text-black font-bold text-lg bg-yellow-400 p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1 max-w-2xl mx-auto">
          {onEmailSend ? (
            <>
              🎉 Payment complete! Click the 📧 button to email your logos! 🚀
            </>
          ) : (
            <>
              Here are your creative variations! Click on any image to unlock
              them! 🔓✨
            </>
          )}
        </p>
      </div>
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
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
            onEmailSend={() =>
              onEmailSend && typeof img === "string" && onEmailSend(img, index)
            }
          />
        ))}
      </div>
    </div>
  );
};
