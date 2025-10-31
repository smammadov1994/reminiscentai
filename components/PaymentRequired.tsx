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
    <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px] space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8">
      <div className="text-center space-y-1 sm:space-y-2 md:space-y-4 lg:space-y-6 max-w-lg">
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-green-400 border-2 sm:border-4 md:border-6 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto transform rotate-3">
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            🎉
          </span>
        </div>

        <div className="space-y-1 sm:space-y-2 md:space-y-3">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-black transform -rotate-1">
            <span className="bg-yellow-400 px-2 sm:px-3 py-1 border-2 sm:border-4 md:border-6 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block">
              COMPLETE!
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-bold text-black bg-pink-400 p-1 sm:p-2 md:p-3 border-2 md:border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
            {generatedImagesCount} logo{generatedImagesCount > 1 ? "s" : ""}{" "}
            ready! 🚀
          </p>
        </div>

        <div className="bg-blue-400 border-2 sm:border-4 md:border-6 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2 transform -rotate-1">
          <div className="text-center space-y-1 sm:space-y-2">
            <p className="text-black font-bold text-xs sm:text-sm md:text-base">
              💳 Pay to unlock!
            </p>
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-black bg-white px-2 sm:px-3 py-1 border-2 md:border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-2">
              ${(totalAmount / 100).toFixed(2)}
            </div>
            <p className="text-black font-bold text-xs sm:text-sm">
              ${(GENERATION_PRICE / 100).toFixed(2)} each! 💰
            </p>
          </div>
        </div>

        <button
          onClick={onPayNow}
          className="w-full bg-green-400 text-black py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 border-2 sm:border-4 md:border-6 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] sm:hover:translate-x-[-2px] sm:hover:translate-y-[-2px] md:hover:translate-x-[-4px] md:hover:translate-y-[-4px] transition-all transform rotate-1 hover:rotate-0 font-black text-sm sm:text-base md:text-lg lg:text-xl"
        >
          🚀 PAY NOW!
        </button>

        <div className="bg-purple-400 border-2 md:border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-1 sm:p-2 transform rotate-2 inline-block">
          <div className="flex items-center justify-center space-x-1 text-black font-bold text-xs sm:text-sm">
            <span className="text-sm sm:text-base">🔒</span>
            <span>SECURE STRIPE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
