"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const INITIAL_DATA = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 64230.50, price_change_percentage_24h: 1.2, image: 'https://assets.coincap.io/assets/icons/btc@2x.png' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3450.12, price_change_percentage_24h: -0.5, image: 'https://assets.coincap.io/assets/icons/eth@2x.png' },
  { id: 'tether', symbol: 'usdt', name: 'Tether', current_price: 1.00, price_change_percentage_24h: 0.01, image: 'https://assets.coincap.io/assets/icons/usdt@2x.png' },
  { id: 'bnb', symbol: 'bnb', name: 'BNB', current_price: 590.40, price_change_percentage_24h: 2.1, image: 'https://assets.coincap.io/assets/icons/bnb@2x.png' },
  { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 145.60, price_change_percentage_24h: 5.4, image: 'https://assets.coincap.io/assets/icons/sol@2x.png' },
  { id: 'xrp', symbol: 'xrp', name: 'XRP', current_price: 0.62, price_change_percentage_24h: -1.2, image: 'https://assets.coincap.io/assets/icons/xrp@2x.png' },
  { id: 'usdc', symbol: 'usdc', name: 'USDC', current_price: 1.00, price_change_percentage_24h: 0.00, image: 'https://assets.coincap.io/assets/icons/usdc@2x.png' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.45, price_change_percentage_24h: -2.3, image: 'https://assets.coincap.io/assets/icons/ada@2x.png' },
  { id: 'avalanche', symbol: 'avax', name: 'Avalanche', current_price: 35.20, price_change_percentage_24h: 4.1, image: 'https://assets.coincap.io/assets/icons/avax@2x.png' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', current_price: 0.16, price_change_percentage_24h: 8.5, image: 'https://assets.coincap.io/assets/icons/doge@2x.png' }
];

export default function Home() {
  const [coins, setCoins] = useState(INITIAL_DATA);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // --- THEME LOGIC ---
  useEffect(() => {
    // Check LocalStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  // --- SIMULATOR ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(currentCoins => 
        currentCoins.map(coin => {
          const volatility = (Math.random() * 0.01) - 0.005; 
          const newPrice = coin.current_price * (1 + volatility);
          return {
            ...coin,
            current_price: newPrice,
            price_change_percentage_24h: coin.price_change_percentage_24h + (volatility * 100)
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cryptoFavorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch (e) { console.log("Storage error"); }
  }, []);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('cryptoFavorites', JSON.stringify(updated));
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // ADDED: min-h-screen and dark background colors
    <div className="min-h-screen p-10 font-sans transition-colors duration-300 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      
      {/* THEME TOGGLE BUTTON */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition z-50 text-2xl"
        title="Toggle Dark Mode"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          CryptoMarket Sim
        </h1>
        
        <div className="text-center mb-6">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            ● Live Market Simulator
          </span>
        </div>

        <div className="mb-8 mt-6">
          <input 
            type="text" 
            placeholder="Search markets..." 
            // ADDED: Dark mode styles for input
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg w-full shadow-sm text-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white dark:bg-gray-800 dark:text-white"
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* CHART SECTION */}
        {/* ADDED: Dark mode styles for card */}
        <div className="mb-10 h-80 w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4 text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Assets Performance</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={filteredCoins.slice(0, 10)}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
              <XAxis 
                dataKey="symbol" 
                tickFormatter={(val) => val.toUpperCase()} 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis hide={true}/>
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.1)'}}
                contentStyle={{
                  borderRadius: '8px', 
                  border: 'none', 
                  backgroundColor: darkMode ? '#1f2937' : '#fff', // Smart Tooltip Color
                  color: darkMode ? '#fff' : '#000',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: darkMode ? '#fff' : '#000' }}
  labelStyle={{ color: darkMode ? '#fff' : '#000' }}
              />
              <Bar dataKey="price_change_percentage_24h" radius={[4, 4, 4, 4]}>
                {filteredCoins.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.price_change_percentage_24h >= 0 ? '#22c55e' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LIST SECTION */}
        <div className="grid grid-cols-1 gap-3">
          {filteredCoins.map((coin) => (
            <Link href={`/coin/${coin.id}`} key={coin.id}>
              {/* ADDED: Dark mode styles for List Item */}
              <div className="p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md hover:scale-[1.01] transition duration-200 cursor-pointer">
                <div className="flex items-center gap-4">
                    <button 
                    onClick={(e) => { e.preventDefault(); toggleFavorite(coin.id); }}
                    className={`text-2xl transition ${favorites.includes(coin.id) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'}`}
                  >
                    {favorites.includes(coin.id) ? '★' : '☆'}
                  </button>
                  
                  <img 
                    src={coin.image} 
                    alt={coin.name} 
                    className="w-10 h-10 rounded-full bg-gray-50"
                    onError={(e) => {e.target.src = 'https://assets.coincap.io/assets/icons/generic@2x.png'}} 
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{coin.name}</h3>
                    <span className="text-xs font-mono text-gray-400 uppercase">{coin.symbol}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">${coin.current_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  <p className={`text-sm font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}