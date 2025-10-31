import React, { useState, useEffect } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  onPricing?: () => void;
  user?: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onLogout,
  onPricing,
  user,
}) => {
  const [currentEmotion, setCurrentEmotion] = useState(0);

  // Cycle through different emoji states to show the concept
  const emotions = ["😊", "😐", "😟", "😠", "😡"];
  const emotionLabels = ["Happy", "Neutral", "Concerned", "Angry", "Furious"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmotion((prev) => (prev + 1) % emotions.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-yellow-300 relative overflow-hidden">
      {/* Colorful Bubbles - Responsive */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 md:top-20 left-4 md:left-10 w-10 md:w-16 h-10 md:h-16 bg-pink-400 rounded-full border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce"></div>
        <div className="absolute top-20 md:top-40 right-8 md:right-20 w-8 md:w-12 h-8 md:h-12 bg-blue-400 rounded-full border-2 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse"></div>
        <div
          className="absolute bottom-16 md:bottom-32 left-8 md:left-20 w-12 md:w-20 h-12 md:h-20 bg-green-400 rounded-full border-2 md:border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-32 md:top-60 left-1/3 w-6 md:w-8 h-6 md:h-8 bg-purple-400 rounded-full border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-10 md:bottom-20 right-16 md:right-32 w-10 md:w-14 h-10 md:h-14 bg-red-400 rounded-full border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-16 md:top-32 right-1/3 w-7 md:w-10 h-7 md:h-10 bg-cyan-400 rounded-full border-2 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-60 left-1/2 w-6 h-6 bg-orange-400 rounded-full border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-bounce"
          style={{ animationDelay: "0.8s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform rotate-3">
            <span className="text-2xl">🦜</span>
          </div>
          <span className="text-black font-black text-2xl transform -rotate-1">
            Logo Reactivator
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={onPricing}
            className="text-black font-bold hover:underline decoration-4 decoration-green-400 underline-offset-4 transition-all transform hover:rotate-1"
          >
            💰 Pricing
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-black font-bold">
                👋 {user.email?.split("@")[0]}
              </span>
              <button
                onClick={onLogout}
                className="bg-red-400 text-black px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform -rotate-1 hover:rotate-0"
              >
                🚪 LOGOUT
              </button>
              <button
                onClick={onGetStarted}
                className="bg-black text-white px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-lg hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-1 hover:rotate-0"
              >
                DASHBOARD
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="bg-black text-white px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-lg hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-1 hover:rotate-0"
            >
              TRY NOW!
            </button>
          )}
        </div>
      </nav>

      {/* Main Content - 50/50 Split */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 min-h-[calc(100vh-120px)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-black text-black leading-tight transform -rotate-2">
                Static?
                <br />
                <span className="text-black bg-pink-400 px-4 py-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-3 mt-4">
                  Dynamic!
                </span>
              </h1>
              <p className="text-xl text-black font-bold leading-relaxed max-w-lg bg-white p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                Give your logos emotional intelligence. Inspired by Duolingo's
                genius design! 🎨
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-6">
              <button
                onClick={user ? onGetStarted : onLogin}
                className="w-full bg-green-400 text-black px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-xl hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all transform -rotate-1 hover:rotate-0"
              >
                🚀 START CREATING NOW!
              </button>

              {/* Pricing Info */}
              <div className="bg-yellow-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 transform rotate-1">
                <div className="text-center space-y-2">
                  <p className="text-black font-black text-lg">
                    💰 Simple Pricing!
                  </p>
                  <p className="text-black font-bold">
                    Only{" "}
                    <span className="bg-white px-2 py-1 border-2 border-black">
                      10¢
                    </span>{" "}
                    per logo generation
                  </p>
                  <button
                    onClick={onPricing}
                    className="bg-white text-black px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform -rotate-1 hover:rotate-0"
                  >
                    📊 View Full Pricing
                  </button>
                </div>
              </div>

              {user && (
                <div className="text-center">
                  <div className="bg-blue-400 border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 inline-block">
                    <p className="text-black font-bold text-sm">
                      👋 Welcome back, {user.email?.split("@")[0]}!
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                <p className="text-sm text-black font-bold">
                  By continuing, you acknowledge our{" "}
                  <a
                    href="#"
                    className="underline decoration-4 decoration-pink-400 underline-offset-2 hover:bg-pink-400 transition-colors"
                  >
                    Privacy Policy
                  </a>{" "}
                  and agree to our{" "}
                  <a
                    href="#"
                    className="underline decoration-4 decoration-blue-400 underline-offset-2 hover:bg-blue-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Visual Demo */}
          <div className="relative">
            <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12 relative overflow-hidden transform rotate-2 hover:rotate-1 transition-transform">
              {/* Colorful decorative elements */}
              <div className="absolute top-4 left-4 w-6 h-6 bg-pink-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-45"></div>
              <div className="absolute top-8 right-8 w-8 h-8 bg-blue-400 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
              <div className="absolute bottom-6 left-8 w-4 h-8 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-12"></div>
              <div className="absolute bottom-12 right-4 w-10 h-6 bg-purple-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-12"></div>

              {/* Main demo area */}
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="text-8xl transition-all duration-500 transform hover:scale-110 hover:rotate-12">
                    {emotions[currentEmotion]}
                  </div>
                  <div className="bg-yellow-300 text-black font-black text-xl px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-2">
                    {emotionLabels[currentEmotion]} State!
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-cyan-400 text-black font-bold px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
                    Days since last visit:
                  </div>
                  <div className="flex justify-center space-x-3">
                    {[0, 1, 3, 7, 14].map((days, index) => (
                      <div
                        key={days}
                        className={`w-6 h-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform ${
                          index === currentEmotion
                            ? "bg-red-400 scale-125 rotate-45"
                            : "bg-gray-300 rotate-12"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="bg-orange-400 text-black font-bold text-sm px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1 max-w-xs">
                    {currentEmotion === 0 && "Active user - happy logo! 😊"}
                    {currentEmotion === 1 && "1 day away - still neutral 😐"}
                    {currentEmotion === 2 &&
                      "3 days away - getting concerned 😟"}
                    {currentEmotion === 3 && "1 week away - clearly upset 😠"}
                    {currentEmotion === 4 &&
                      "2 weeks away - absolutely furious! 😡"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
