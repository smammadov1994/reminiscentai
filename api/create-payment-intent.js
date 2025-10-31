// Simple API endpoint for creating Stripe payment intents
// This would normally be on your backend server

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'usd', metadata } = req.body;

    // In a real implementation, you would:
    // 1. Initialize Stripe with your secret key
    // 2. Create a payment intent
    // 3. Return the client secret

    // For development, return a mock response
    const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;

    res.status(200).json({
      clientSecret: mockClientSecret,
      amount,
      currency,
      metadata
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
}