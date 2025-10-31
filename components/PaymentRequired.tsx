import React from "react";
import { GENERATION_PRICE } from "../services/stripeService";

interface PaymentRequiredProps {
  onPayNow: () => void;
  generatedImagesCount: number;
}

export const PaymentRequired: React.FC<PaymentRequiredProps> = ({
  onPayNow,
  generatedImagesCount,
}) => {
  const totalAmount = generatedImagesCount * GENERATION_PRICE;

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 p-8">
      <div className="text-center space-y-8 max-w-lg">
        <div className="w-24 h-24 bg-green-400 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto transform rotate-3">
          <span className="text-5xl">🎉</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-black transform -rotate-1">
            <span className="bg-yellow-400 px-4 py-2 border-6 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block">
              GENERATION COMPLETE!
            </span>
          </h2>
          <p className="text-xl font-bold text-black bg-pink-400 p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
            Your {generatedImagesCount} amazing logo transformation
            {generatedImagesCount > 1 ? "s are" : " is"} ready! 🚀
          </p>
        </div>

        <div className="bg-blue-400 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4 transform -rotate-1">
          <div className="text-center space-y-3">
            <p className="text-black font-bold text-lg">
              💳 Complete your payment to unlock your creations!
            </p>
            <div className="text-4xl font-black text-black bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-2">
              ${(totalAmount / 100).toFixed(2)}
            </div>
            <p className="text-black font-bold">
              Only ${(GENERATION_PRICE / 100).toFixed(2)} per generation! 💰
            </p>
          </div>
        </div>

        <button
          onClick={onPayNow}
          className="w-full bg-green-400 text-black py-6 px-8 border-6 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all transform rotate-1 hover:rotate-0 font-black text-2xl"
        >
          🚀 PAY NOW & VIEW RESULTS!
        </button>

        <div className="bg-purple-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 transform rotate-2 inline-block">
          <div className="flex items-center justify-center space-x-2 text-black font-bold">
            <span className="text-xl">🔒</span>
            <span>SECURE PAYMENT WITH STRIPE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
