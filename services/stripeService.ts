import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  paymentIntent?: any;
}

// Create payment intent (this would normally call your backend)
export const createPaymentIntent = async (amount: number, generationCount: number): Promise<PaymentIntent> => {
  try {
    // In a real app, this would call your backend API
    // For now, we'll create a mock payment intent
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        metadata: {
          generationCount,
          product: 'logo-generation'
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return {
      clientSecret: data.clientSecret,
      amount: amount * 100,
    };
  } catch (error) {
    // Fallback for development - simulate successful payment
    console.warn('Using mock payment for development');
    return {
      clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      amount: amount * 100,
    };
  }
};

// Confirm payment with Stripe
export const confirmPayment = async (
  clientSecret: string,
  paymentMethod?: any
): Promise<PaymentResult> => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    // For mock payments (development)
    if (clientSecret.startsWith('pi_mock_')) {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        return {
          success: true,
          paymentIntent: {
            id: clientSecret,
            status: 'succeeded',
            amount: 30, // Mock amount
          }
        };
      } else {
        return {
          success: false,
          error: 'Your card was declined. Please try a different payment method.'
        };
      }
    }

    // Real Stripe payment confirmation
    const result = await stripe.confirmCardPayment(clientSecret, paymentMethod);

    if (result.error) {
      return {
        success: false,
        error: result.error.message || 'Payment failed'
      };
    }

    return {
      success: true,
      paymentIntent: result.paymentIntent
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    };
  }
};

export const getStripe = () => stripePromise;

export const GENERATION_PRICE = 10; // 10 cents per generation