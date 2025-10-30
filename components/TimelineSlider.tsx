import React from 'react';
import { timelineMilestones } from '../services/geminiService';

interface TimelineSliderProps {
  milestoneIndex: number;
  onMilestoneChange: (index: number) => void;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({ milestoneIndex, onMilestoneChange }) => {
  const min = 0;
  const max = timelineMilestones.length - 1;
  const progress = (milestoneIndex / max) * 100;

  const labels = ['1D', '5D', '8D', '12D', '18D', '30D', '3M', '4M', '6M', '1Y'];

  return (
    <>
      <style>{`
        @keyframes pulse-thumb-white {
          0%, 100% {
            box-shadow: 0 0 10px rgba(228, 228, 231, 0.5);
            border-width: 3px;
          }
          50% {
            box-shadow: 0 0 18px rgba(228, 228, 231, 0.8);
            border-width: 4px;
          }
        }
        .timeline-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 12px;
          background: linear-gradient(90deg, #e4e4e7 ${progress}%, #404040 ${progress}%);
          border-radius: 10px;
          outline: none;
          transition: background 0.1s ease-in-out;
        }
        .timeline-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 32px;
          height: 32px;
          background: #18181b;
          cursor: pointer;
          border-radius: 50%;
          border: 3px solid #e4e4e7;
          box-shadow: 0 0 10px rgba(228, 228, 231, 0.5);
          margin-top: -10px;
          animation: pulse-thumb-white 2s infinite ease-in-out;
        }
        .timeline-slider::-moz-range-thumb {
          width: 32px;
          height: 32px;
          background: #18181b;
          cursor: pointer;
          border-radius: 50%;
          border: 3px solid #e4e4e7;
          box-shadow: 0 0 10px rgba(228, 228, 231, 0.5);
          animation: pulse-thumb-white 2s infinite ease-in-out;
        }
      `}</style>
      <div className="flex flex-col items-center w-full">
        <input
          type="range"
          min={min}
          max={max}
          value={milestoneIndex}
          onChange={(e) => onMilestoneChange(Number(e.target.value))}
          className="timeline-slider"
          aria-label="Timeline Slider"
        />
         <div className="w-full flex justify-between text-xs text-gray-500 mt-2 px-1">
          {labels.map(label => <span key={label}>{label}</span>)}
        </div>
      </div>
    </>
  );
};