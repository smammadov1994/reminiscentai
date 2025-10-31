import React from "react";
import { TimelineSlider } from "./TimelineSlider";
import { GenerateIcon } from "./icons/GenerateIcon";
import { timelineMilestones } from "../services/geminiService";

interface SliderStepProps {
  milestoneIndex: number;
  onMilestoneChange: (index: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const SliderStep: React.FC<SliderStepProps> = ({
  milestoneIndex,
  onMilestoneChange,
  onGenerate,
  isGenerating,
}) => {
  const currentMilestone = timelineMilestones[milestoneIndex];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-black mb-2 sm:mb-3 md:mb-4 transform -rotate-1">
          <span className="bg-yellow-400 px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 border-2 sm:border-4 md:border-6 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
            ⏰ CHOOSE PERIOD!
          </span>
        </h2>
        <p className="text-black font-bold text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 lg:mb-12 bg-pink-400 p-2 sm:p-3 md:p-4 border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] lg:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1 max-w-2xl mx-auto">
          Move the slider to set how long you've been away! The longer you're
          gone, the sadder your logo gets! 😢
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-4 sm:mb-6 md:mb-8 lg:mb-12">
          <div className="flex-grow w-full">
            <TimelineSlider
              milestoneIndex={milestoneIndex}
              onMilestoneChange={onMilestoneChange}
            />
          </div>
          <div className="flex-shrink-0 w-32 sm:w-36 md:w-40 h-12 sm:h-14 md:h-16 lg:h-20 bg-white border-2 sm:border-4 md:border-6 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center px-2 sm:px-3 md:px-4 transform rotate-2">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-black text-center leading-tight">
              {currentMilestone.label}
            </span>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full max-w-sm mx-auto flex items-center justify-center bg-green-400 text-black font-black py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 border-2 sm:border-4 md:border-6 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] sm:hover:translate-x-[-2px] sm:hover:translate-y-[-2px] md:hover:translate-x-[-4px] md:hover:translate-y-[-4px] transition-all transform rotate-1 hover:rotate-0 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base md:text-lg lg:text-xl"
        >
          <GenerateIcon
            className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 sm:mr-3 ${
              isGenerating ? "animate-spin" : ""
            }`}
          />
          {isGenerating ? "🔄 GENERATING..." : "🚀 GENERATE ARTIFACTS!"}
        </button>
      </div>
    </div>
  );
};
