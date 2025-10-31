import React from "react";
import { CloseIcon } from "./icons/CloseIcon";

interface ArtifactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ArtifactPanel: React.FC<ArtifactPanelProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 transition-opacity duration-500 z-20 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-[80vh] sm:h-[75vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] bg-white border-2 sm:border-4 md:border-8 border-black shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[0px_-8px_0px_0px_rgba(0,0,0,1)] md:shadow-[0px_-16px_0px_0px_rgba(0,0,0,1)] z-30 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-y-0 rotate-0" : "translate-y-full rotate-2"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 p-3 sm:p-4 md:p-5 bg-red-400 border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all transform rotate-12 hover:rotate-0"
          aria-label="Close panel"
        >
          <CloseIcon className="w-5 h-5 md:w-7 md:h-7 text-black font-bold" />
        </button>

        {/* Decorative elements - responsive */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-45"></div>
        <div className="absolute top-4 left-8 md:top-8 md:left-16 w-4 h-4 md:w-6 md:h-6 bg-pink-400 rounded-full border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"></div>
        <div className="absolute bottom-2 right-10 md:bottom-4 md:right-20 w-3 h-5 md:w-5 md:h-8 bg-green-400 border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-12"></div>

        <div className="h-full w-full relative z-10">{children}</div>
      </div>
    </>
  );
};
