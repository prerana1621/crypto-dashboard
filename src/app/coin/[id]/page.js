"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

const COIN_DB = {
  bitcoin: { name: "Bitcoin", symbol: "BTC", price: 64230.50, marketCap: 1200000000000, volume: 35000000000, change: 1.2, description: "Bitcoin is the first successful internet money based on peer-to-peer technology." },
  ethereum: { name: "Ethereum", symbol: "ETH", price: 3450.12, marketCap: 400000000000, volume: 15000000000, change: -0.5, description: "Ethereum is a decentralized platform that runs smart contracts." },
  tether: { name: "Tether", symbol: "USDT", price: 1.00, marketCap: 110000000000, volume: 45000000000, change: 0.01, description: "Tether is a stablecoin pegged to the US Dollar." },
  bnb: { name: "BNB", symbol: "BNB", price: 590.40, marketCap: 87000000000, volume: 1200000000, change: 2.1, description: "BNB is the native token of the Binance ecosystem." },
  solana: { name: "Solana", symbol: "SOL", price: 145.60, marketCap: 65000000000, volume: 2000000000, change: 5.4, description: "Solana is a high-performance blockchain supporting builders around the world." },
  xrp: { name: "XRP", symbol: "XRP", price: 0.62, marketCap: 34000000000, volume: 1000000000, change: -1.2, description: "XRP is a digital asset built for payments." },
  usdc: { name: "USDC", symbol: "USDC", price: 1.00, marketCap: 32000000000, volume: 3000000000, change: 0.00, description: "USDC is a fully reserved stablecoin." },
  cardano: { name: "Cardano", symbol: "ADA", price: 0.45, marketCap: 16000000000, volume: 400000000, change: -2.3, description: "Cardano is a proof-of-stake blockchain platform." },
  avalanche: { name: "Avalanche", symbol: "AVAX", price: 35.20, marketCap: 13000000000, volume: 600000000, change: 4.1, description: "Avalanche is an open, programmable smart contracts platform." },
  dogecoin: { name: "Dogecoin", symbol: "DOGE", price: 0.16, marketCap: 23000000000, volume: 1800000000, change: 8.5, description: "Dogecoin is an open source peer-to-peer digital currency." }
};

export default function CoinDetail({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [coin, setCoin] = useState(null);

  // 1. PERSIST DARK MODE: Check if we should be dark on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const foundCoin = COIN_DB[id];
    if (foundCoin) {
      const volatility = (Math.random() * 0.02) - 0.01; 
      const livePrice = foundCoin.price * (1 + volatility);
      setCoin({
        ...foundCoin,
        priceUsd: livePrice,
        change24: foundCoin.change,
        vwap: livePrice * 0.98 
      });
    }
  }, [id]);

  if (!coin) return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-400 bg-gray-50 dark:bg-gray-900">Loading Market Data...</div>;

  const isPositive = coin.change24 >= 0;
  const sentiment = isPositive ? "Bullish (Buy Trend)" : "Bearish (Sell Pressure)";

  return (
    // 2. MAIN CONTAINER: Added dark backgrounds
    <div className="min-h-screen p-10 font-sans bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-black dark:hover:text-white mb-6 inline-flex items-center gap-2 font-medium transition">
          ← Back to Live Dashboard
        </Link>
        
        {/* 3. CARD: Added dark background and border */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* Header */}
          <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
            <div className="flex items-center gap-6">
              <img 
                src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} 
                alt={coin.name} 
                className="w-16 h-16"
                onError={(e) => {e.target.src = 'https://assets.coincap.io/assets/icons/generic@2x.png'}} 
              />
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{coin.name}</h1>
                <span className="text-xl text-gray-400 font-mono">{coin.symbol}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">${coin.priceUsd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <div className={`text-lg font-medium mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(coin.change24).toFixed(2)}% (24h)
              </div>
            </div>
          </div>

          {/* AI Sentiment Box */}
          <div className="p-8 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
             <div className={`p-4 rounded-lg border border-dashed ${isPositive ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Market Sentiment</h3>
                <p className={`text-2xl font-bold ${isPositive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {sentiment}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Technical indicators suggest {isPositive ? 'buying volume is increasing' : 'selling pressure is high'} based on simulated market depth.
                </p>
             </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 dark:bg-gray-700">
            {/* FIX: Changed dark:hover:bg-gray-750 to dark:hover:bg-gray-700 */}
            <div className="bg-white dark:bg-gray-800 p-8 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Market Cap</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">${(coin.marketCap / 1e9).toFixed(2)} Billion</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Volume (24h)</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">${(coin.volume / 1e9).toFixed(2)} Billion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}