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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white">Payment Required</h2>

          <p className="text-gray-300">
            Your logo transformations are ready! Complete your payment to view
            and download your generated images.
          </p>
        </div>

        <div className="bg-zinc-700 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Generated images:</span>
            <span>{generatedImagesCount}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Price per generation:</span>
            <span>${(GENERATION_PRICE / 100).toFixed(2)}</span>
          </div>
          <div className="border-t border-zinc-600 pt-2 mt-2">
            <div className="flex justify-between text-white font-semibold">
              <span>Total:</span>
              <span>${(totalAmount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {paymentError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{paymentError}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-white text-black py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Pay $${(totalAmount / 100).toFixed(2)}`
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full bg-zinc-700 text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};
