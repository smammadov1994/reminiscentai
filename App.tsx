import React, { useState, useCallback, useRef, useEffect } from "react";
import { UploadStep } from "./components/UploadStep";
import { DisplayStep } from "./components/DisplayStep";
import { LandingPage } from "./components/LandingPage";
import { PaymentRequired } from "./components/PaymentRequired";
import { PaymentModal } from "./components/PaymentModal";
import { EmailModal } from "./components/EmailModal";
import { AuthModal } from "./components/AuthModal";
import { PricingPage } from "./components/PricingPage";
import { fileToBase64 } from "./utils/fileUtils";
import {
  generateSadImage,
  styleModifiers,
  timelineMilestones,
} from "./services/geminiService";
import { initEmailService } from "./services/emailService";
import { HistorySidebar } from "./components/HistorySidebar";
import { ArtifactPanel } from "./components/ArtifactPanel";
import { SliderStep } from "./components/SliderStep";
import { historyDB, HistoryEntry } from "./services/historyService";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

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

const AppContent: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(
    null
  );
  const [paymentRequired, setPaymentRequired] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [paymentTimer, setPaymentTimer] = useState<NodeJS.Timeout | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [selectedImageForEmail, setSelectedImageForEmail] =
    useState<string>("");
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
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);

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

  const handlePaymentSuccess = async () => {
    console.log("Payment success handler called!");
    setIsPaid(true);
    setPaymentRequired(false);
    setShowPaymentModal(false);

    // Save to IndexedDB when payment is successful
    if (originalImage && generatedImages.length > 0) {
      try {
        console.log("Saving generation to database...", {
          originalImage: !!originalImage,
          generatedImagesCount: generatedImages.length,
          milestoneLabel: timelineMilestones[milestoneIndex].label,
          milestoneIndex,
          favoritedIndex,
        });

        const savedId = await historyDB.saveGeneration({
          originalImage,
          generatedImages,
          milestoneLabel: timelineMilestones[milestoneIndex].label,
          milestoneIndex,
          favoritedIndex,
          isPaid: true,
        });
        console.log("Generation saved to history database with ID:", savedId);
        // Trigger history refresh
        setHistoryRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Failed to save generation to history:", error);
      }
    } else {
      console.log("Not saving - missing data:", {
        hasOriginalImage: !!originalImage,
        generatedImagesCount: generatedImages.length,
      });
    }
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

  const handleEmailSend = (imageUrl: string, index: number) => {
    console.log("Email button clicked!", { imageUrl, index, isPaid });
    setSelectedImageForEmail(imageUrl);
    setShowEmailModal(true);
  };

  const handleEmailModalClose = () => {
    setShowEmailModal(false);
    setSelectedImageForEmail("");
  };

  const handleHistoryItemClick = (entry: HistoryEntry) => {
    // Restore the generation from history
    setOriginalImage(entry.originalImage);
    setGeneratedImages(entry.generatedImages);
    setMilestoneIndex(entry.milestoneIndex);
    setFavoritedIndex(entry.favoritedIndex);
    setIsPaid(entry.isPaid);
    setArtifactStep("display");
    setPaymentRequired(false);

    // Clear any existing timers
    if (paymentTimer) {
      clearTimeout(paymentTimer);
      setPaymentTimer(null);
    }

    console.log("Restored generation from history:", entry.id);
  };

  // Update favorite in database when it changes in current session
  useEffect(() => {
    const updateFavoriteInDB = async () => {
      if (isPaid && originalImage && generatedImages.length > 0) {
        try {
          // Find the current entry in database and update it
          const allEntries = await historyDB.getAllHistory();
          const currentEntry = allEntries.find(
            (entry) =>
              entry.originalImage.base64 === originalImage.base64 &&
              entry.milestoneIndex === milestoneIndex &&
              entry.isPaid
          );

          if (currentEntry && currentEntry.favoritedIndex !== favoritedIndex) {
            await historyDB.updateHistory(currentEntry.id, { favoritedIndex });
            setHistoryRefreshTrigger((prev) => prev + 1);
            console.log("Updated favorite in database");
          }
        } catch (error) {
          console.error("Failed to update favorite in database:", error);
        }
      }
    };

    updateFavoriteInDB();
  }, [favoritedIndex, isPaid, originalImage, milestoneIndex, generatedImages]);

  const handleHistoryDelete = async (entryId: string) => {
    try {
      await historyDB.deleteHistory(entryId);
      setHistoryRefreshTrigger((prev) => prev + 1);
      console.log("Deleted history entry:", entryId);
    } catch (error) {
      console.error("Failed to delete history entry:", error);
    }
  };

  // Initialize email service on component mount
  useEffect(() => {
    initEmailService();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyan-300 flex items-center justify-center">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
          <div className="text-2xl font-black text-black">⏳ Loading...</div>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return (
      <>
        <LandingPage
          onGetStarted={() => setShowLanding(false)}
          onLogin={() => setShowAuthModal(true)}
          onLogout={() => {
            signOut();
            setShowLanding(true);
          }}
          onPricing={() => setShowPricingModal(true)}
          user={user}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => {
            setShowAuthModal(false);
            setShowLanding(false);
          }}
        />
        <PricingPage
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-cyan-300 relative overflow-hidden">
      {/* Background bubbles for dashboard - responsive */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 md:top-10 left-4 lg:left-20 w-8 md:w-12 h-8 md:h-12 bg-pink-400 rounded-full border-2 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse"></div>
        <div className="absolute top-16 md:top-32 right-8 md:right-40 w-6 md:w-8 h-6 md:h-8 bg-yellow-400 border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-45 animate-bounce"></div>
        <div
          className="absolute bottom-20 md:bottom-40 left-8 lg:left-32 w-10 md:w-16 h-10 md:h-16 bg-green-400 rounded-full border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-4 md:right-20 w-4 md:w-6 h-4 md:h-6 bg-purple-400 border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-12 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-8 md:bottom-20 right-1/4 md:right-1/3 w-6 md:w-10 h-6 md:h-10 bg-orange-400 rounded-full border-2 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Mobile History Button */}
      <button
        onClick={() => setIsSidebarPinned(!isSidebarPinned)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-purple-400 border-4 border-black px-3 py-2 font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-3 hover:rotate-0"
      >
        📚 HISTORY
      </button>

      {/* User Menu */}
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <UserMenu
            user={user}
            onLogout={() => {
              signOut();
              setShowLanding(true);
            }}
          />
        </div>
      )}

      {/* Mobile History Overlay */}
      {isSidebarPinned && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarPinned(false)}
        />
      )}

      <HistorySidebar
        history={history}
        isPinned={isSidebarPinned}
        onPinToggle={() => setIsSidebarPinned((p) => !p)}
        onBackToLanding={handleBackToLanding}
        onHistoryItemClick={handleHistoryItemClick}
        onHistoryDelete={handleHistoryDelete}
        refreshTrigger={historyRefreshTrigger}
      />
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 lg:ml-64 xl:ml-72 pt-16 lg:pt-2">
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
                onEmailSend={isPaid ? handleEmailSend : undefined}
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

          {/* Email Modal */}
          <EmailModal
            isOpen={showEmailModal}
            onClose={handleEmailModalClose}
            imageUrl={selectedImageForEmail}
            imageName="Generated Logo"
            userId={user?.id}
          />

          {/* Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={() => setShowAuthModal(false)}
          />
        </div>
      </main>
    </div>
  );
};

// User Menu Component
const UserMenu: React.FC<{ user: any; onLogout: () => void }> = ({
  user,
  onLogout,
}) => {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-400 border-4 border-black px-3 py-2 font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform -rotate-2 hover:rotate-0"
      >
        👤 {user.email?.split("@")[0]}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-48">
          <div className="p-2">
            <div className="text-xs text-gray-600 p-2 border-b-2 border-black">
              {user.email}
            </div>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full text-left p-2 font-bold text-black hover:bg-red-400 transition-colors"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App with Auth Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
