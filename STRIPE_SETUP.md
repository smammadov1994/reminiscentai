# Stripe Payment Setup for Logo Reactivator

This guide will help you set up Stripe payments for your logo generation service.

## 1. Get Your Stripe API Keys

1. **Go to your Stripe Dashboard** → Developers → API keys
2. **Copy your keys:**
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

## 2. Update Environment Variables

Update your `.env.local` file:

```env
# Replace with your actual Stripe keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

## 3. Current Implementation (Development Mode)

**What works now:**

- ✅ Payment modal with proper UI
- ✅ Price calculation (10¢ per generation)
- ✅ Mock payment processing
- ✅ Success/error handling
- ✅ Professional payment flow

**Development Features:**

- Uses mock payments (90% success rate)
- No real money is charged
- Simulates real payment delays
- Tests the complete user flow

## 4. Test the Payment Flow

1. **Generate some logos** in your app
2. **Click "Pay Now"** when prompted
3. **Click the payment button** in the modal
4. **See the payment processing** animation
5. **Payment should succeed** (90% of the time in dev mode)

## 5. For Production (Real Payments)

To enable real payments, you'll need:

### Backend API Endpoint

Create a backend endpoint that:

```javascript
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/api/create-payment-intent", async (req, res) => {
  const { amount, currency = "usd" } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // in cents
    currency: currency,
    metadata: {
      product: "logo-generation",
    },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});
```

### Frontend Integration

The frontend is already set up to:

- Create payment intents
- Handle Stripe confirmations
- Process success/failure states
- Show proper error messages

## 6. Pricing Structure

- **10¢ per logo generation**
- **Example costs:**
  - 1 generation = $0.10
  - 3 generations = $0.30
  - 5 generations = $0.50
  - 10 generations = $1.00

## 7. Security Features

✅ **Client-side validation**
✅ **Secure payment processing via Stripe**
✅ **No card details stored locally**
✅ **PCI compliance through Stripe**
✅ **Error handling and user feedback**

## 8. Testing Cards (Stripe Test Mode)

Use these test card numbers:

- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **Insufficient funds**: `4000000000009995`

## 9. Next Steps

1. **Test the current flow** with mock payments
2. **Set up a backend** (Node.js, Python, etc.)
3. **Create the payment intent endpoint**
4. **Update the frontend** to use real endpoint
5. **Switch to live Stripe keys** for production

The payment system is ready to go - just needs a backend for real payment processing!
