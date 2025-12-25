"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CAD", "CHF", "CNY"];

export default function Forex() {
  const [rates, setRates] = useState([]);
  const [isDark, setIsDark] = useState(false);

  const [amount, setAmount] = useState("1");
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("INR");
  const [result, setResult] = useState(0);

  /* ---------------- THEME LISTENER ---------------- */
  useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  /* ---------------- FETCH REAL FOREX DATA ---------------- */
  useEffect(() => {
    fetch("/api/forex")
      .then((res) => res.json())
      .then((data) => {
        const formatted = [
          { id: "eurusd", pair: "EUR/USD", price: 1 / data.rates.EUR, flag: "🇪🇺", type: "direct" },
          { id: "gbpusd", pair: "GBP/USD", price: 1 / data.rates.GBP, flag: "🇬🇧", type: "direct" },
          { id: "audusd", pair: "AUD/USD", price: 1 / data.rates.AUD, flag: "🇦🇺", type: "direct" },
          { id: "usdjpy", pair: "USD/JPY", price: data.rates.JPY, flag: "🇯🇵", type: "inverse" },
          { id: "usdinr", pair: "USD/INR", price: data.rates.INR, flag: "🇮🇳", type: "inverse" },
          { id: "usdcad", pair: "USD/CAD", price: data.rates.CAD, flag: "🇨🇦", type: "inverse" },
          { id: "usdchf", pair: "USD/CHF", price: data.rates.CHF, flag: "🇨🇭", type: "inverse" },
          { id: "usdcny", pair: "USD/CNY", price: data.rates.CNY, flag: "🇨🇳", type: "inverse" },
        ];
        setRates(formatted);
      });
  }, []);

  /* ---------------- CONVERTER LOGIC ---------------- */
  useEffect(() => {
    const getToUSDRate = (code) => {
      if (code === "USD") return 1;
      const pair = rates.find((r) => r.pair.includes(code));
      if (!pair) return 1;
      return pair.type === "direct" ? pair.price : 1 / pair.price;
    };

    const fromRate = getToUSDRate(fromCur);
    const toRate = getToUSDRate(toCur);

    const safeAmount = parseFloat(amount) || 0;
    const valInUSD = safeAmount * fromRate;
    setResult(valInUSD / toRate);
  }, [rates, amount, fromCur, toCur]);

  /* ---------------- SMART SWAP ---------------- */
  const handleFromChange = (e) => {
    const newFrom = e.target.value;
    if (newFrom === toCur) setToCur(fromCur);
    setFromCur(newFrom);
  };

  const handleToChange = (e) => {
    const newTo = e.target.value;
    if (newTo === fromCur) setFromCur(toCur);
    setToCur(newTo);
  };

  // Normalize prices for color strength
  const prices = rates.map((r) => r.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  const getBarColor = (price) => {
    const strength = (price - minPrice) / (maxPrice - minPrice || 1);
    return strength > 0.66 ? "#22c55e" : strength > 0.33 ? "#3b82f6" : "#8b5cf6";
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Global Forex Markets 
      </h1>

      {/* CONVERTER SECTION */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[24px] shadow-2xl text-white">
        
        {/* Header */}
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          Quick Converter
        </h2>

        <div className="flex flex-col md:flex-row items-end gap-4">
          
          {/* BLOCK 1: AMOUNT */}
          <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-white/70 mb-1.5 block uppercase tracking-wide">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-14 pl-4 pr-4 rounded-xl bg-white/20 border border-white/20 text-white placeholder-white/50 text-xl font-medium focus:outline-none focus:bg-white/30 transition-all"
            />
          </div>

          {/* BLOCK 2: FROM */}
          <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-white/70 mb-1.5 block uppercase tracking-wide">
              From
            </label>
            <div className="relative">
              <select
                value={fromCur}
                onChange={handleFromChange}
                className="w-full h-14 pl-4 pr-10 rounded-xl bg-white/20 border border-white/20 text-white text-xl font-medium appearance-none cursor-pointer focus:outline-none focus:bg-white/30 transition-all"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c} className="bg-white text-gray-900 dark:bg-slate-800 dark:text-white">
                    {c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/70">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="pb-4 text-white/60">
            <svg className="w-6 h-6 transform md:rotate-0 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </div>

          {/* BLOCK 3: TO */}
          <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-white/70 mb-1.5 block uppercase tracking-wide">
              To
            </label>
            <div className="relative">
              <select
                value={toCur}
                onChange={handleToChange}
                className="w-full h-14 pl-4 pr-10 rounded-xl bg-white/20 border border-white/20 text-white text-xl font-medium appearance-none cursor-pointer focus:outline-none focus:bg-white/30 transition-all"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c} className="bg-white text-gray-900 dark:bg-slate-800 dark:text-white">
                    {c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/70">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* BLOCK 4: RESULT */}
          <div className="flex-[1.5] w-full h-14 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between px-5 relative overflow-hidden">
             <div className="absolute top-1 right-3 text-[10px] text-white/60 uppercase font-bold tracking-wider">
               Result
             </div>
             
             <div /> 
             
             <div className="text-right pt-1">
                <span className="text-2xl font-bold tracking-tight text-white">
                  {result.toFixed(2)}
                </span>
                <span className="text-sm font-medium ml-2 text-white/80">
                  {toCur}
                </span>
             </div>
          </div>

        </div>
      </div>

      {/* LIVE RATES + CHART */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LIST: LIVE RATES */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          {/* 1. Header Row */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
             <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
               Live Exchange Rates
             </h3>
          </div>

          {rates.map((rate) => (
            <div
              key={rate.id}
              className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {/* Currency Pair + Flag */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{rate.flag}</span> 
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{rate.pair}</span>
              </div>

              {/* Price + Live Indicator */}
              <div className="text-right">
                <div className="font-mono font-bold text-xl text-gray-800 dark:text-white leading-none">
                  {rate.price.toFixed(4)}
                </div>
                
                <div className="flex items-center justify-end gap-1.5 mt-1.5 animate-pulse">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]" />
                   <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide">
                     Live
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            USD Strength Index
          </h3>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart layout="vertical" data={rates} margin={{ left: 0, right: 30 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="pair"
                type="category"
                width={70}
                tick={{
                  fill: isDark ? "#e5e7eb" : "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#ffffff",
                  color: isDark ? "#ffffff" : "#000000",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  padding: "12px"
                }}
                itemStyle={{ color: isDark ? "#ffffff" : "#000000", fontWeight: "bold" }}
              />
              <Bar
                dataKey="price"
                isAnimationActive
                animationDuration={800}
                radius={[0, 6, 6, 0]}
                barSize={28}
              >
                {rates.map((rate) => (
                  <Cell key={rate.id} fill={getBarColor(rate.price)} />
                ))}
                <LabelList
                  dataKey="price"
                  position="right"
                  formatter={(value) => value.toFixed(4)}
                  style={{
                    fill: isDark ? "#e5e7eb" : "#111827",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}