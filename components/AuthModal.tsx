import React, { useState } from "react";
import { auth } from "../lib/supabase";
import { CloseIcon } from "./icons/CloseIcon";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { data, error } = await auth.signIn(email, password);
        if (error) throw error;
        setSuccess("Welcome back! 🎉");
        setTimeout(() => {
          onAuthSuccess();
          onClose();
        }, 1000);
      } else {
        const { data, error } = await auth.signUp(email, password);
        if (error) throw error;
        setSuccess("Account created! Check your email to verify. 📧");
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(null);
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setSuccess(null);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isOpen) return null;

  // Show setup message if Supabase is not configured
  if (!auth.isConfigured()) {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/70 transition-opacity duration-500 z-50"
          onClick={onClose}
        />

        {/* Setup Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 md:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 max-w-md w-full transform rotate-1 hover:rotate-0 transition-all">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-4 bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-12 hover:rotate-0"
            >
              <CloseIcon className="w-6 h-6 text-black" />
            </button>

            {/* Setup Content */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-black text-black mb-4 transform -rotate-1">
                <span className="bg-orange-400 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
                  🔧 SETUP REQUIRED
                </span>
              </h2>

              <div className="bg-yellow-300 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                <p className="text-black font-bold text-sm mb-2">
                  🚀 Authentication is not configured yet!
                </p>
                <p className="text-black text-sm">
                  Please follow the setup guide in{" "}
                  <code className="bg-white px-1 border border-black">
                    SUPABASE_SETUP.md
                  </code>{" "}
                  to enable login functionality.
                </p>
              </div>

              <div className="bg-blue-400 border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                <p className="text-black font-bold text-xs">
                  💡 For now, you can use the app without authentication!
                </p>
              </div>

              <button
                onClick={onClose}
                className="bg-green-400 text-black font-black py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-1 hover:rotate-0"
              >
                👍 GOT IT!
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 transition-opacity duration-500 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white border-4 md:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 max-w-md w-full transform rotate-1 hover:rotate-0 transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-4 bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-12 hover:rotate-0"
          >
            <CloseIcon className="w-6 h-6 text-black" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-black mb-2 transform -rotate-1">
              <span className="bg-yellow-400 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
                {isLogin ? "🔑 LOGIN" : "🚀 SIGN UP"}
              </span>
            </h2>
            <p className="text-black font-bold text-sm bg-pink-400 p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1 inline-block">
              {isLogin ? "Welcome back, creator!" : "Join the logo revolution!"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-black font-black text-sm mb-2 transform -rotate-1 inline-block bg-blue-400 px-2 py-1 border-2 border-black">
                📧 EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all font-bold text-black bg-white"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-black font-black text-sm mb-2 transform rotate-1 inline-block bg-green-400 px-2 py-1 border-2 border-black">
                🔒 PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all font-bold text-black bg-white"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-400 border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                <p className="text-black font-bold text-sm">❌ {error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-400 border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                <p className="text-black font-bold text-sm">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-400 text-black font-black py-4 px-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform rotate-1 hover:rotate-0 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
            >
              {loading
                ? "⏳ LOADING..."
                : isLogin
                ? "🚀 LOGIN NOW!"
                : "✨ CREATE ACCOUNT!"}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="text-center mt-6">
            <button
              onClick={switchMode}
              className="text-black font-bold text-sm bg-cyan-400 px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform -rotate-1 hover:rotate-0"
            >
              {isLogin
                ? "Don't have an account? Sign up!"
                : "Already have an account? Login!"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
