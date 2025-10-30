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
        className={`fixed bottom-0 left-0 right-0 h-[75vh] bg-white border-8 border-black shadow-[0px_-16px_0px_0px_rgba(0,0,0,1)] z-30 p-6 sm:p-8 md:p-10 transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-y-0 rotate-0" : "translate-y-full rotate-2"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-12 hover:rotate-0"
          aria-label="Close panel"
        >
          <CloseIcon className="w-6 h-6 text-black font-bold" />
        </button>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-yellow-400 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-45"></div>
        <div className="absolute top-8 left-16 w-6 h-6 bg-pink-400 rounded-full border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"></div>
        <div className="absolute bottom-4 right-20 w-5 h-8 bg-green-400 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-12"></div>

        <div className="h-full w-full relative z-10">{children}</div>
      </div>
    </>
  );
};
