import React, { useState, useEffect } from "react";
import type { HistoryItem } from "../App";
import { HistoryIcon } from "./icons/HistoryIcon";
import {
  historyDB,
  HistoryEntry,
  formatHistoryDate,
  getHistoryPreview,
} from "../services/historyService";

interface HistorySidebarProps {
  history: HistoryItem[];
  isPinned?: boolean;
  onPinToggle?: () => void;
  onBackToLanding?: () => void;
  onHistoryItemClick?: (entry: HistoryEntry) => void;
  refreshTrigger?: number;
  onHistoryDelete?: (entryId: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  isPinned,
  onPinToggle,
  onBackToLanding,
  onHistoryItemClick,
  refreshTrigger,
  onHistoryDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [dbHistory, setDbHistory] = useState<HistoryEntry[]>([]);
  const isOpen = isHovered || isPinned;

  // Load history from database
  const loadHistory = async () => {
    try {
      console.log("Loading history from database...");
      const entries = await historyDB.getAllHistory();
      console.log("Loaded history entries:", entries.length, entries);
      setDbHistory(entries);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  // Initialize database and load history
  useEffect(() => {
    console.log("Initializing history database...");
    historyDB
      .init()
      .then(() => {
        console.log("Database initialized, loading history...");
        loadHistory();
      })
      .catch((error) => {
        console.error("Failed to initialize database:", error);
      });
  }, []);

  // Refresh history when trigger changes
  useEffect(() => {
    if (refreshTrigger) {
      loadHistory();
    }
  }, [refreshTrigger]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Add a longer delay before closing to prevent flickering
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 1000); // 1 second delay
    setCloseTimeout(timeout);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 bg-white border-r-4 md:border-r-8 border-black shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out ${
        isOpen ? "w-64 md:w-72" : "w-16"
      } ${
        isPinned
          ? "translate-x-0"
          : "lg:translate-x-0 -translate-x-full lg:block"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 md:h-20 border-b-2 md:border-b-4 border-black px-2 md:px-4 bg-purple-400">
          <div
            className={`flex items-center gap-2 md:gap-3 transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <HistoryIcon className="w-6 h-6 md:w-8 md:h-8 text-black" />
            <h2 className="font-black text-black whitespace-nowrap text-lg md:text-xl transform -rotate-1">
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
          {dbHistory.length === 0 && isOpen && (
            <div className="text-center text-gray-600 mt-8 px-4">
              <div className="bg-yellow-300 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                <p className="text-sm font-bold">
                  🎨 No history yet! Complete a paid generation to see your
                  creations here.
                </p>
              </div>
            </div>
          )}
          <ul
            className={`space-y-3 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 delay-100"
            }`}
          >
            {dbHistory.map((entry) => (
              <li
                key={entry.id}
                className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-1 hover:rotate-0 relative group cursor-pointer"
                onClick={() => onHistoryItemClick?.(entry)}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-black text-purple-600 uppercase">
                      {formatHistoryDate(entry.timestamp)}
                    </p>
                    <div className="flex items-center gap-2">
                      {entry.isPaid && (
                        <span className="text-xs bg-green-400 border-2 border-black px-2 py-1 font-black transform -rotate-3">
                          💰 PAID
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onHistoryDelete?.(entry.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-400 border-2 border-black px-2 py-1 text-xs font-black hover:bg-red-500 transform rotate-3 hover:rotate-0"
                        title="Delete this generation"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-black mb-3">
                    📅 {entry.milestoneLabel}
                  </p>

                  <div className="flex gap-1 mb-2 justify-center">
                    {entry.generatedImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        {typeof img === "string" ? (
                          <img
                            src={img}
                            alt={`Generated ${idx + 1}`}
                            className={`w-12 h-12 rounded border-2 border-black object-cover ${
                              entry.favoritedIndex === idx
                                ? "ring-4 ring-yellow-400"
                                : ""
                            }`}
                          />
                        ) : img === "error" ? (
                          <div className="w-12 h-12 rounded border-2 border-black bg-red-300 flex items-center justify-center">
                            <span className="text-xs">❌</span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded border-2 border-black bg-gray-200 flex items-center justify-center">
                            <span className="text-xs">⏳</span>
                          </div>
                        )}
                        {entry.favoritedIndex === idx && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center">
                            <span className="text-xs">⭐</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-gray-600 font-medium">
                    {getHistoryPreview(entry)}
                  </p>
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
