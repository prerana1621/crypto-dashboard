"use client";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  // 1. NEW STATE: To keep track of favorite coin IDs
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch Data
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    // 2. LOAD FAVORITES: Check if user has saved coins before
    const saved = localStorage.getItem('cryptoFavorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // 3. TOGGLE FUNCTION: Add or Remove from favorites
  const toggleFavorite = (id) => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id); // Remove
    } else {
      updatedFavorites = [...favorites, id]; // Add
    }
    setFavorites(updatedFavorites);
    // Save to browser memory immediately
    localStorage.setItem('cryptoFavorites', JSON.stringify(updatedFavorites));
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-5 text-center">Crypto Market Dashboard</h1>
      
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Filter coins..." 
          className="p-3 border border-gray-300 rounded w-full text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange} 
        />
      </div>

      <div className="mb-10 h-64 w-full bg-white p-4 rounded shadow-md border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Price Comparison (USD)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredCoins}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="current_price" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCoins.map((coin) => (
          <div key={coin.id} className="p-4 border rounded flex justify-between items-center shadow-sm hover:shadow-md transition bg-white">
            <div className="flex items-center gap-4">
              {/* 4. THE STAR BUTTON */}
              <button 
                onClick={() => toggleFavorite(coin.id)}
                className="text-2xl focus:outline-none"
              >
                {/* Change color if favorite */}
                {favorites.includes(coin.id) ? '⭐' : '☆'}
              </button>
              
              <img src={coin.image} alt={coin.name} className="w-8 h-8"/>
              <span className="font-semibold text-lg">{coin.name}</span> 
            </div>
            <span className="font-bold text-gray-700">${coin.current_price.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}