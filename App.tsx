import React, { useState, useCallback, useRef } from "react";
import { UploadStep } from "./components/UploadStep";
import { DisplayStep } from "./components/DisplayStep";
import { LandingPage } from "./components/LandingPage";
import { PaymentRequired } from "./components/PaymentRequired";
import { PaymentModal } from "./components/PaymentModal";
import { fileToBase64 } from "./utils/fileUtils";
import {
  generateSadImage,
  styleModifiers,
  timelineMilestones,
} from "./services/geminiService";
import { HistorySidebar } from "./components/HistorySidebar";
import { ArtifactPanel } from "./components/ArtifactPanel";
import { SliderStep } from "./components/SliderStep";

export interface OriginalImage {
  base64: string;
  mimeType: string;
  url: string;
}

export type GeneratedImageState = string | null | "error";

export interface HistoryItem {
  originalImage: OriginalImage;
  generatedImage: GeneratedImageState;
  milestoneLabel: string;
}

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(
    null
  );
  const [paymentRequired, setPaymentRequired] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [paymentTimer, setPaymentTimer] = useState<NodeJS.Timeout | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageState[]>(
    []
  );
  const [milestoneIndex, setMilestoneIndex] = useState<number>(5); // Default to 30 days
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favoritedIndex, setFavoritedIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [artifactStep, setArtifactStep] = useState<"slider" | "display">(
    "slider"
  );

  const generationController = useRef<AbortController | null>(null);

  const triggerGeneration = useCallback(
    async (recreateIndex?: number) => {
      if (!originalImage) return;

      if (generationController.current) {
        generationController.current.abort();
      }
      generationController.current = new AbortController();
      const { signal } = generationController.current;

      setIsGenerating(true);
      setError(null);

      const currentMilestone = timelineMilestones[milestoneIndex];

      const updateImage = (index: number, data: GeneratedImageState) => {
        setGeneratedImages((prev) => {
          if (signal.aborted) return prev;
          const newImages = [...prev];
          newImages[index] = data;
          return newImages;
        });
      };

      // If we are recreating a single image
      if (typeof recreateIndex === "number") {
        updateImage(recreateIndex, null); // Set to loading
        try {
          const modifier = styleModifiers[recreateIndex];
          const result = await generateSadImage(
            originalImage.base64,
            originalImage.mimeType,
            currentMilestone.key,
            modifier
          );
          if (signal.aborted) return;
          updateImage(recreateIndex, `data:image/png;base64,${result}`);
        } catch (e) {
          if (signal.aborted) return;
          console.error(
            `Failed to regenerate image for style ${recreateIndex}`,
            e
          );
          updateImage(recreateIndex, "error");
        }
      } else {
        // Initial generation for all three
        setGeneratedImages([null, null, null]);
        setFavoritedIndex(null);
        const allPromises = styleModifiers.map(async (modifier, index) => {
          try {
            const result = await generateSadImage(
              originalImage.base64,
              originalImage.mimeType,
              currentMilestone.key,
              modifier
            );
            if (signal.aborted) return;
            updateImage(index, `data:image/png;base64,${result}`);
          } catch (e) {
            if (signal.aborted) return;
            console.error(`Failed to generate image for style ${index}`, e);
            updateImage(index, "error");
          }
        });
        await Promise.allSettled(allPromises);
      }

      if (!signal.aborted) {
        setIsGenerating(false);
        // Start 5-second timer for payment screen after generation completes
        if (typeof recreateIndex !== "number") {
          // Only show payment for initial generation, not for single image recreation
          const timer = setTimeout(() => {
            setPaymentRequired(true);
          }, 5000);
          setPaymentTimer(timer);
        }
      }
    },
    [originalImage, milestoneIndex]
  );

  const handleImageUpload = async (file: File) => {
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const url = URL.createObjectURL(file);
      const newImage = { base64, mimeType, url };
      setOriginalImage(newImage);
      setArtifactStep("slider");
      setGeneratedImages([]);
      setError(null);
    } catch (e) {
      setError("Failed to process the image file. Please try a different one.");
      console.error(e);
    }
  };

  const handleGenerate = () => {
    setArtifactStep("display");
    triggerGeneration();
  };

  const handleStartOver = () => {
    if (generationController.current) {
      generationController.current.abort();
    }

    if (
      originalImage &&
      favoritedIndex !== null &&
      typeof generatedImages[favoritedIndex] === "string"
    ) {
      const newHistoryItem: HistoryItem = {
        originalImage,
        generatedImage: generatedImages[favoritedIndex],
        milestoneLabel: timelineMilestones[milestoneIndex].label,
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    }

    setOriginalImage(null);
    setGeneratedImages([]);
    setError(null);
    setMilestoneIndex(5);
    setIsGenerating(false);
    setFavoritedIndex(null);
    setArtifactStep("slider");
    setPaymentRequired(false);
    setShowPaymentModal(false);
    setIsPaid(false);
    if (paymentTimer) {
      clearTimeout(paymentTimer);
      setPaymentTimer(null);
    }
  };

  const handleBackToLanding = () => {
    handleStartOver();
    setShowLanding(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setPaymentRequired(false);
    setShowPaymentModal(false);
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const handleImageClick = () => {
    // If timer is running, clear it and show payment immediately
    if (paymentTimer) {
      clearTimeout(paymentTimer);
      setPaymentTimer(null);
    }
    setPaymentRequired(true);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen flex bg-cyan-300 relative overflow-hidden">
      {/* Background bubbles for dashboard */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-12 h-12 bg-pink-400 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse"></div>
        <div className="absolute top-32 right-40 w-8 h-8 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-45 animate-bounce"></div>
        <div
          className="absolute bottom-40 left-32 w-16 h-16 bg-green-400 rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-20 w-6 h-6 bg-purple-400 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-12 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-10 h-10 bg-orange-400 rounded-full border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <HistorySidebar
        history={history}
        isPinned={isSidebarPinned}
        onPinToggle={() => setIsSidebarPinned((p) => !p)}
        onBackToLanding={handleBackToLanding}
      />
      <main
        className={`relative z-10 flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 transition-all duration-300 ${
          isSidebarPinned ? "ml-0 lg:ml-72" : "ml-0 lg:ml-16"
        }`}
      >
        <div className="w-full h-full flex-grow container mx-auto max-w-7xl relative flex items-center justify-center">
          <UploadStep
            onImageUpload={handleImageUpload}
            isLoading={!!originalImage}
          />

          <ArtifactPanel isOpen={!!originalImage} onClose={handleStartOver}>
            {artifactStep === "slider" && originalImage && (
              <SliderStep
                milestoneIndex={milestoneIndex}
                onMilestoneChange={setMilestoneIndex}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            )}
            {artifactStep === "display" && paymentRequired && !isPaid && (
              <PaymentRequired
                onPayNow={handlePayNow}
                generatedImagesCount={
                  generatedImages.filter((img) => typeof img === "string")
                    .length
                }
              />
            )}
            {artifactStep === "display" && (!paymentRequired || isPaid) && (
              <DisplayStep
                generatedImages={generatedImages}
                isGenerating={isGenerating}
                favoritedIndex={favoritedIndex}
                onFavoriteChange={setFavoritedIndex}
                onRecreateSingle={(index) => triggerGeneration(index)}
                onImageClick={!isPaid ? handleImageClick : undefined}
              />
            )}
          </ArtifactPanel>

          {/* Payment Modal */}
          <PaymentModal
            isOpen={showPaymentModal}
            onPaymentSuccess={handlePaymentSuccess}
            onClose={handlePaymentCancel}
            generatedImagesCount={
              generatedImages.filter((img) => typeof img === "string").length
            }
          />
        </div>
      </main>
    </div>
  );
};

export default App;
