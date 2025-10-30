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
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-zinc-700 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white">
            Generation Complete!
          </h2>
          <p className="text-xl text-gray-300">
            Your {generatedImagesCount} logo transformation
            {generatedImagesCount > 1 ? "s are" : " is"} ready
          </p>
        </div>

        <div className="bg-zinc-800 rounded-xl p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-gray-300">
              Complete your payment to view and download your generated images
            </p>
            <div className="text-2xl font-bold text-white">
              ${(totalAmount / 100).toFixed(2)}
            </div>
            <p className="text-sm text-gray-400">
              ${(GENERATION_PRICE / 100).toFixed(2)} per generation
            </p>
          </div>
        </div>

        <button
          onClick={onPayNow}
          className="w-full bg-white text-black py-4 px-8 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
        >
          Pay Now & View Results
        </button>

        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">Secure payment with Stripe</span>
        </div>
      </div>
    </div>
  );
};
