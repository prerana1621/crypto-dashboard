"use client";
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const INITIAL_STOCKS = [
  { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', price: 175.40, change: 1.2, sector: 'Tech' },
  { id: 'msft', symbol: 'MSFT', name: 'Microsoft', price: 402.10, change: 0.8, sector: 'Tech' },
  { id: 'googl', symbol: 'GOOGL', name: 'Alphabet', price: 142.60, change: -0.5, sector: 'Tech' },
  { id: 'amzn', symbol: 'AMZN', name: 'Amazon', price: 178.20, change: 2.1, sector: 'Retail' },
  { id: 'tsla', symbol: 'TSLA', name: 'Tesla', price: 198.50, change: -3.2, sector: 'Auto' },
  { id: 'nflx', symbol: 'NFLX', name: 'Netflix', price: 605.30, change: 1.5, sector: 'Media' },
  { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA', price: 850.00, change: 4.5, sector: 'Chips' },
  { id: 'jpm', symbol: 'JPM', name: 'JPMorgan', price: 188.10, change: 0.2, sector: 'Finance' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Stocks() {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(current => 
        current.map(stock => {
          const volatility = (Math.random() * 0.005) - 0.0025; 
          const newPrice = stock.price * (1 + volatility);
          return {
            ...stock,
            price: newPrice,
            change: stock.change + (volatility * 100)
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Wall Street Simulator 🏙️</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* MARKET CHART */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 h-80">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase">Market Trend (S&P 500 Sim)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stocks}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} stroke={isDark ? '#555' : '#ccc'} />
              <XAxis 
                dataKey="symbol" 
                tick={{fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10}} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000', borderRadius: '8px', border: 'none'}}
                itemStyle={{color: isDark ? '#fff' : '#000'}}
              />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* SECTOR PIE CHART */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700 h-80 flex flex-col items-center justify-center">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase w-full text-left">Sector Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stocks}
                dataKey="price"
                nameKey="sector"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                stroke={isDark ? '#1f2937' : '#fff'}
              >
                {stocks.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* FIX IS HERE: Added itemStyle to force text white */}
              <Tooltip 
                 contentStyle={{backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000', borderRadius: '8px', border: 'none'}}
                 itemStyle={{color: isDark ? '#fff' : '#000'}} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xs text-gray-400 mt-2">Diversification Health: Strong</div>
        </div>
      </div>

      {/* STOCK LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stocks.map((stock) => (
          <div key={stock.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{stock.symbol}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stock.name}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${stock.change >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">${stock.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}