"use client";  // Required for useRouter in Next.js App Router

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();  // Correct usage of useRouter

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white px-6">
      {/* Headline */}
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
        Welcome to <span className="text-blue-400">FinNFT</span>
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
        Empowering the future of finance with AI-driven NFT generation and smart financial portfolio management.  
        Secure, automated, and tailored for your success.
      </p>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-3 text-blue-400">AI-Powered NFT Generation</h2>
          <p className="text-gray-300">
            Create unique NFTs based on financial insights and user preferences. Leverage AI to generate high-value digital assets.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-3 text-blue-400">Smart Financial Portfolio</h2>
          <p className="text-gray-300">
            Manage your investments with AI-driven analytics. Get personalized recommendations for better financial decisions.
          </p>
        </div>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="mt-10 flex space-x-6">
        {/* Explore Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-lg"
        >
          Explore Dashboard
        </button>

        {/* Create an AI NFT Button */}
        <button
          onClick={() => window.open("http://localhost:3001", "_blank")}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-lg"
        >
          Create an AI NFT
        </button>
      </div>
    </div>
  );
}
