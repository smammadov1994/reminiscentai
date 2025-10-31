import React, { useState } from "react";
import { GENERATION_PRICE } from "../services/stripeService";

interface PaymentModalProps {
  isOpen: boolean;
  onPaymentSuccess: () => void;
  onClose: () => void;
  generatedImagesCount: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onPaymentSuccess,
  onClose,
  generatedImagesCount,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const totalAmount = generatedImagesCount * GENERATION_PRICE;

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would:
      // 1. Create payment intent on your backend
      // 2. Confirm payment with Stripe
      // 3. Handle the result

      // For now, we'll simulate a successful payment
      onPaymentSuccess();
    } catch (error) {
      setPaymentError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md w-full transform rotate-1">
        {/* Header */}
        <div className="bg-yellow-400 border-b-8 border-black p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-12 hover:rotate-0"
          >
            <span className="text-black font-black text-xl">✕</span>
          </button>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-white border-6 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto transform -rotate-3">
              <span className="text-4xl">💳</span>
            </div>

            <h2 className="text-3xl font-black text-black transform -rotate-1">
              💰 PAYMENT TIME!
            </h2>

            <p className="text-black font-bold">
              Your logo transformations are ready! Pay to unlock your amazing
              creations! 🚀
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Price Breakdown */}
          <div className="bg-blue-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 transform rotate-1">
            <div className="space-y-3">
              <div className="flex justify-between text-black font-bold">
                <span>🎨 Generated images:</span>
                <span>{generatedImagesCount}</span>
              </div>
              <div className="flex justify-between text-black font-bold">
                <span>💵 Price per generation:</span>
                <span>${(GENERATION_PRICE / 100).toFixed(2)}</span>
              </div>
              <div className="border-t-4 border-black pt-3 mt-3">
                <div className="flex justify-between text-black font-black text-xl">
                  <span>🔥 TOTAL:</span>
                  <span>${(totalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {paymentError && (
            <div className="bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 transform -rotate-1">
              <p className="text-black font-black text-center">
                💥 {paymentError}
              </p>
            </div>
          )}

          {/* Payment Buttons */}
          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-green-400 text-black py-4 px-6 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all transform rotate-1 hover:rotate-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>💫 PROCESSING...</span>
                </div>
              ) : (
                `🚀 PAY $${(totalAmount / 100).toFixed(2)} NOW!`
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full bg-gray-400 text-black py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform -rotate-1 hover:rotate-0 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              ❌ CANCEL
            </button>
          </div>

          {/* Stripe Badge */}
          <div className="text-center">
            <div className="bg-purple-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block px-4 py-2 transform rotate-2">
              <p className="text-black font-black text-sm">
                🔒 SECURE PAYMENT BY STRIPE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
