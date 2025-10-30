import React, { useState } from "react";
import type { HistoryItem } from "../App";
import { HistoryIcon } from "./icons/HistoryIcon";
import { PinIcon } from "./icons/PinIcon";

interface HistorySidebarProps {
  history: HistoryItem[];
  isPinned?: boolean; // Made optional since we're not using it
  onPinToggle?: () => void; // Made optional since we're not using it
  onBackToLanding?: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  isPinned,
  onPinToggle,
  onBackToLanding,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const isOpen = isHovered; // Removed pin functionality, only hover-based now

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow moving to the pin button
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 300); // 300ms delay
    setCloseTimeout(timeout);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-10 bg-white border-r-8 border-black shadow-[8px_0px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out ${
        isOpen ? "w-72" : "w-16"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-20 border-b-4 border-black px-4 bg-purple-400">
          <div
            className={`flex items-center gap-3 transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <HistoryIcon className="w-8 h-8 text-black" />
            <h2 className="font-black text-black whitespace-nowrap text-xl transform -rotate-1">
              📚 HISTORY
            </h2>
          </div>
        </div>

        {/* Back to Landing Button */}
        {onBackToLanding && (
          <div className="px-4 py-3 border-b-4 border-black bg-green-400">
            <button
              onClick={onBackToLanding}
              className={`w-full flex items-center gap-3 p-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-1 hover:rotate-0 ${
                isOpen ? "justify-start" : "justify-center"
              }`}
            >
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span
                className={`text-black font-black whitespace-nowrap transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                🏠 BACK HOME!
              </span>
            </button>
          </div>
        )}

        <div className="flex-grow overflow-y-auto p-2">
          {history.length === 0 && isOpen && (
            <div className="text-center text-gray-500 mt-8 px-4">
              <p className="text-sm">
                Your favorited creations will appear here after you complete a
                session.
              </p>
            </div>
          )}
          <ul
            className={`space-y-2 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 delay-100"
            }`}
          >
            {history.map((item, index) => (
              <li
                key={index}
                className="bg-zinc-700/50 p-2 rounded-md border border-zinc-600"
              >
                <p className="text-xs text-gray-400 mb-2">
                  Period:{" "}
                  <span className="font-bold text-gray-300">
                    {item.milestoneLabel}
                  </span>
                </p>
                <div className="flex gap-2">
                  <img
                    src={item.originalImage.url}
                    alt="Original"
                    className="w-12 h-12 rounded object-contain bg-zinc-900"
                  />
                  {typeof item.generatedImage === "string" && (
                    <img
                      src={item.generatedImage}
                      alt="Generated"
                      className="w-12 h-12 rounded object-contain bg-black"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Collapsed view icon */}
      <div
        className={`absolute top-6 left-0 right-0 flex justify-center items-center transition-opacity duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <HistoryIcon className="w-7 h-7 text-gray-300" />
      </div>
    </aside>
  );
};
