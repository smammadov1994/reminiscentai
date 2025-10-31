import React from "react";

interface PricingPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  isOpen,
  onClose,
}) => {
  const pricingTiers = [
    {
      generations: 1,
      price: 0.1,
      popular: false,
      description: "Perfect for testing",
      emoji: "🎯",
    },
    {
      generations: 3,
      price: 0.3,
      popular: true,
      description: "Most popular choice",
      emoji: "🔥",
    },
    {
      generations: 5,
      price: 0.5,
      popular: false,
      description: "Great for variations",
      emoji: "⚡",
    },
    {
      generations: 10,
      price: 1.0,
      popular: false,
      description: "Maximum creativity",
      emoji: "🚀",
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay with outside click */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div
          className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-7xl w-full max-h-[90vh] overflow-y-auto transform -rotate-1 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-yellow-400 border-b-8 border-black p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-4 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-12 hover:rotate-0"
            >
              <span className="text-black font-black text-2xl">✕</span>
            </button>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white border-6 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto transform rotate-3">
                <span className="text-4xl">💰</span>
              </div>

              <h1 className="text-4xl font-black text-black transform rotate-1">
                💸 SIMPLE PRICING!
              </h1>

              <p className="text-black font-bold text-lg">
                Pay only for what you generate! No subscriptions, no hidden
                fees! 🎉
              </p>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Pricing Explanation */}
            <div className="bg-blue-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 transform rotate-1">
              <h2 className="text-2xl font-black text-black mb-4 transform -rotate-1">
                🤔 HOW IT WORKS:
              </h2>
              <div className="space-y-3 text-black font-bold">
                <p>
                  • Each logo generation costs exactly{" "}
                  <span className="bg-yellow-300 px-2 py-1 border-2 border-black">
                    10¢
                  </span>
                </p>
                <p>• Generate 3 logos = 30¢ total</p>
                <p>• Generate 10 logos = $1.00 total</p>
                <p>• No monthly fees, no commitments!</p>
              </div>
            </div>

            {/* Pricing Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {pricingTiers.map((tier, index) => (
                <div
                  key={tier.generations}
                  className={`
                    border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 transform min-h-[400px] 
                    ${
                      tier.popular
                        ? "bg-green-400 rotate-2 scale-105"
                        : "bg-white hover:bg-gray-100"
                    }
                    ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}
                    hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] 
                    hover:translate-x-[-4px] hover:translate-y-[-4px] 
                    transition-all cursor-pointer
                  `}
                >
                  {tier.popular && (
                    <div className="bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 py-1 transform -rotate-12 absolute -top-3 -right-3">
                      <span className="text-black font-black text-sm">
                        POPULAR!
                      </span>
                    </div>
                  )}

                  <div className="text-center space-y-6">
                    <div className="text-6xl">{tier.emoji}</div>

                    <h3 className="text-2xl font-black text-black">
                      {tier.generations} GENERATION
                      {tier.generations > 1 ? "S" : ""}
                    </h3>

                    <div className="bg-black text-white p-3 border-4 border-black transform rotate-2">
                      <div className="text-3xl font-black">
                        ${tier.price.toFixed(2)}
                      </div>
                      <div className="text-sm font-bold">10¢ per logo</div>
                    </div>

                    <p className="text-black font-bold text-sm">
                      {tier.description}
                    </p>

                    <div className="space-y-2 text-black font-bold text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <span>✅</span>
                        <span>High-quality logos</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span>✅</span>
                        <span>Instant download</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span>✅</span>
                        <span>Commercial use</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Why This Pricing */}
            <div className="bg-purple-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 transform -rotate-1">
              <h2 className="text-2xl font-black text-black mb-4 transform rotate-1">
                🎯 WHY 10¢ PER GENERATION?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black font-bold">
                <div className="space-y-2">
                  <p>• AI processing costs money 💸</p>
                  <p>• High-quality results need powerful models 🧠</p>
                  <p>• Fair pricing for everyone 🤝</p>
                </div>
                <div className="space-y-2">
                  <p>• No hidden fees or subscriptions 🚫</p>
                  <p>• Pay only for what you use ⚡</p>
                  <p>• Much cheaper than hiring a designer 💰</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-orange-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 transform rotate-1">
              <h2 className="text-2xl font-black text-black mb-4 transform -rotate-1">
                ❓ FREQUENTLY ASKED QUESTIONS:
              </h2>
              <div className="space-y-4 text-black font-bold">
                <div>
                  <p className="font-black">Q: Can I get a refund?</p>
                  <p>
                    A: Yes! If you're not happy with your logos, we'll refund
                    you within 24 hours.
                  </p>
                </div>
                <div>
                  <p className="font-black">Q: Do I own the generated logos?</p>
                  <p>
                    A: Absolutely! Full commercial rights included with every
                    generation.
                  </p>
                </div>
                <div>
                  <p className="font-black">Q: Are there any monthly fees?</p>
                  <p>
                    A: Nope! Pay per generation only. No subscriptions, no
                    commitments.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={onClose}
                className="bg-green-400 text-black py-4 px-8 border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all transform rotate-2 hover:rotate-0 font-black text-xl"
              >
                🚀 START GENERATING LOGOS!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
