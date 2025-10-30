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
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="w-4/5 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-black text-black mb-4 transform -rotate-1">
          <span className="bg-yellow-400 px-6 py-3 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
            ⏰ CHOOSE INACTIVITY PERIOD!
          </span>
        </h2>
        <p className="text-black font-bold text-lg mb-12 bg-pink-400 p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1 max-w-2xl mx-auto">
          Move the slider to set how long you've been away! The longer you're
          gone, the sadder your logo gets! 😢
        </p>

        <div className="flex items-center gap-8 mb-12">
          <div className="flex-grow">
            <TimelineSlider
              milestoneIndex={milestoneIndex}
              onMilestoneChange={onMilestoneChange}
            />
          </div>
          <div className="flex-shrink-0 w-40 h-20 bg-white border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center px-4 transform rotate-2">
            <span className="text-2xl font-black text-black">
              {currentMilestone.label}
            </span>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full max-w-sm mx-auto flex items-center justify-center bg-green-400 text-black font-black py-4 px-8 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all transform rotate-1 hover:rotate-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xl"
        >
          <GenerateIcon
            className={`h-6 w-6 mr-3 ${isGenerating ? "animate-spin" : ""}`}
          />
          {isGenerating ? "🔄 GENERATING..." : "🚀 GENERATE ARTIFACTS!"}
        </button>
      </div>
    </div>
  );
};
