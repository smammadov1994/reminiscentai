import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
}

export const createPaymentIntent = async (amount: number): Promise<PaymentIntent> => {
  // For development, we'll use a mock response
  // In production, this would call your backend API
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful response
    return {
      clientSecret: `pi_mock_${Date.now()}_secret`,
      amount: amount * 100, // Convert to cents
    };
  } catch (error) {
    throw new Error('Failed to create payment intent');
  }
};

export const getStripe = () => stripePromise;

export const GENERATION_PRICE = 10; // 10 cents per generation