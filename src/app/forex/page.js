"use client";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- FOREX DATA ---
// We classify pairs to know the math logic (is USD the base or the quote?)
const INITIAL_FOREX = [
  { id: 'eurusd', pair: 'EUR/USD', price: 1.08, flag: '🇪🇺', type: 'direct' }, // 1 EUR = 1.08 USD
  { id: 'gbpusd', pair: 'GBP/USD', price: 1.26, flag: '🇬🇧', type: 'direct' },
  { id: 'usdjpy', pair: 'USD/JPY', price: 150.5, flag: '🇯🇵', type: 'inverse' }, // 1 USD = 150.5 JPY
  { id: 'usdinr', pair: 'USD/INR', price: 83.12, flag: '🇮🇳', type: 'inverse' },
  { id: 'audusd', pair: 'AUD/USD', price: 0.65, flag: '🇦🇺', type: 'direct' },
  { id: 'usdcad', pair: 'USD/CAD', price: 1.35, flag: '🇨🇦', type: 'inverse' },
  { id: 'usdchf', pair: 'USD/CHF', price: 0.88, flag: '🇨🇭', type: 'inverse' },
  { id: 'usdcny', pair: 'USD/CNY', price: 7.19, flag: '🇨🇳', type: 'inverse' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY'];

export default function Forex() {
  const [rates, setRates] = useState(INITIAL_FOREX);
  const [isDark, setIsDark] = useState(false);

  // Converter State
  const [amount, setAmount] = useState(1);
  const [fromCur, setFromCur] = useState('USD');
  const [toCur, setToCur] = useState('INR');
  const [result, setResult] = useState(0);

  // 1. Theme Listener
  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 2. Simulator (Updates Prices)
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(current => 
        current.map(pair => {
          const volatility = (Math.random() * 0.001) - 0.0005; 
          return { ...pair, price: pair.price * (1 + volatility) };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Conversion Logic (Runs whenever rates, amount, or selection changes)
  useEffect(() => {
    const convert = () => {
      // Helper to get USD rate for any currency
      const getToUSDRate = (code) => {
        if (code === 'USD') return 1;
        const pair = rates.find(r => r.pair.includes(code));
        if (!pair) return 1;
        // If EUR/USD (Direct): Price is 1.08. So 1 EUR = 1.08 USD.
        if (pair.type === 'direct') return pair.price;
        // If USD/INR (Inverse): Price is 83. So 1 INR = 1/83 USD.
        return 1 / pair.price;
      };

      const fromRate = getToUSDRate(fromCur); // Value in USD
      const toRate = getToUSDRate(toCur);     // Value in USD

      // Math: (Amount * From_Value_In_USD) / To_Value_In_USD
      const valInUSD = amount * fromRate;
      const finalVal = valInUSD / toRate;
      
      setResult(finalVal);
    };

    convert();
  }, [rates, amount, fromCur, toCur]);

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Global Forex Markets 🌍</h1>

      {/* --- NEW: CONVERTER TOOL --- */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg text-white">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          💱 Quick Converter
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          
          <div className="flex-1 w-full">
            <label className="block text-xs uppercase opacity-80 mb-1">Amount</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs uppercase opacity-80 mb-1">From</label>
            <select 
              value={fromCur}
              onChange={(e) => setFromCur(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none [&>option]:text-black"
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="text-2xl pb-2 opacity-80">➔</div>

          <div className="flex-1 w-full">
            <label className="block text-xs uppercase opacity-80 mb-1">To</label>
            <select 
              value={toCur}
              onChange={(e) => setToCur(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none [&>option]:text-black"
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex-[1.5] w-full bg-white/10 rounded-lg p-2 text-right">
            <div className="text-xs opacity-70">Result</div>
            <div className="text-2xl font-bold">{result.toFixed(2)} <span className="text-sm opacity-80">{toCur}</span></div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT: LIVE RATES */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-500 dark:text-gray-400 uppercase text-sm">
            Live Exchange Rates
          </div>
          {rates.map((rate) => (
            <div key={rate.id} className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{rate.flag}</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">{rate.pair}</span>
              </div>
              <div className="text-right">
                <div className="font-mono text-xl font-bold text-gray-900 dark:text-gray-100">{rate.price.toFixed(4)}</div>
                <div className="text-xs text-green-500 animate-pulse">● Live</div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: CHART */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">USD Strength Index</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={rates} margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="pair" 
                  type="category" 
                  width={70} 
                  tick={{fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12, fontWeight: 600}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#fff' : '#000', borderRadius: '8px', border: 'none'}}
                   itemStyle={{color: isDark ? '#fff' : '#000'}}
                />
                <Bar dataKey="price" barSize={15} radius={[0, 4, 4, 0]}>
                  {rates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}