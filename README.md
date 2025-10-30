# 🦜 Logo Reactivator

_Bringing the magic of Duolingo's emotional logo to everyone_

## The Inspiration 💡

You know that feeling when you haven't opened Duolingo in a few days and the owl starts looking... disappointed? Or downright angry? That brilliant design choice where the app icon itself becomes part of the user experience fascinated me.

The way Duolingo's bird transforms based on your streak - from happy and encouraging to increasingly concerned and eventually furious - is pure genius. It's not just an app icon; it's an emotional connection that lives right on your home screen.

## What This Does ✨

This project gives **everyone** the power to create dynamic, emotionally-responsive logos for their apps, websites, or projects. Why should Duolingo have all the fun?

### Features

- 🎭 **Emotional States**: Create logos that change based on user behavior
- ⏰ **Time-Based Reactions**: Icons that respond to inactivity periods
- 🎨 **Customizable Expressions**: Design your own character's emotional journey
- 🔧 **Easy Integration**: Drop into any project with minimal setup
- 📱 **Cross-Platform**: Works on web, mobile, and desktop

## The Magic Behind It 🪄

Just like Duolingo's owl gets progressively more concerned as days pass without practice, your logo can:

- Start happy and encouraging
- Show mild concern after a day of inactivity
- Look worried after a few days
- Get downright dramatic after a week
- Maybe even pack its bags and threaten to leave (looking at you, Duolingo!)

## Getting Started 🚀

```bash
# Clone this repo
git clone [your-repo-url]

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open http://localhost:3001 and watch your logo come to life!

## Why This Matters 🎯

User engagement isn't just about notifications and badges. Sometimes the most powerful motivation comes from something as simple as seeing your app's mascot give you puppy dog eyes because you haven't visited in a while.

This project democratizes that emotional design pattern that Duolingo perfected, making it available for:

- Habit tracking apps
- Learning platforms
- Productivity tools
- Games and entertainment
- Any app that benefits from gentle (or not-so-gentle) user nudging

## Built With 💻

- React 19
- TypeScript
- Vite
- Google Generative AI
- Pure creative obsession with Duolingo's design genius

## Contributing 🤝

Have ideas for new emotional states? Want to add support for different mascot types? PRs welcome! Let's make the internet a more emotionally expressive place, one logo at a time.

---

_Inspired by the passive-aggressive genius of Duolingo's owl. No birds were harmed in the making of this project._

## 💳 Payment Integration

Logo Reactivator uses Stripe for secure payment processing. Each logo generation costs $0.10.

### Payment Flow

1. Upload your logo and configure settings
2. Generate your emotional logo variations
3. Complete payment to view and download results
4. Enjoy your dynamic logos!

### Development Setup

1. Get your Stripe test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Add them to your `.env.local`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

### Production Deployment

- Replace test keys with live Stripe keys
- Set up webhook endpoints for payment confirmation
- Implement proper backend API for payment intent creation
- Add user authentication and payment history
