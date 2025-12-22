"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList} from "recharts";

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

  // 🔥 Normalize prices for color strength
const prices = rates.map(r => r.price);
const maxPrice = Math.max(...prices);
const minPrice = Math.min(...prices);

const getBarColor = (price) => {
  const strength = (price - minPrice) / (maxPrice - minPrice || 1);

  // Strong → Green, Weak → Purple/Blue
  return strength > 0.66
    ? "#22c55e"   // strong green
    : strength > 0.33
    ? "#3b82f6"   // medium blue
    : "#8b5cf6";  // weak purple
};

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Global Forex Markets 🌍
      </h1>

      {/* CONVERTER */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg text-white">
        <h2 className="text-lg font-bold mb-4">💱 Quick Converter</h2>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-white/20 border border-white/30"
          />

          <select
            value={fromCur}
            onChange={handleFromChange}
            className="p-3 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
  {CURRENCIES.map(c => (
    <option
      key={c}
      value={c}
      className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
    >
      {c}
    </option>
  ))}
</select>


          <span className="text-2xl">➔</span>

          <select
  value={toCur}
  onChange={handleToChange}
  className="p-3 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  {CURRENCIES.map(c => (
    <option
      key={c}
      value={c}
      className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
    >
      {c}
    </option>
  ))}
</select>


          <div className="flex-1 text-right font-bold text-2xl">
            {result.toFixed(2)} {toCur}
          </div>
        </div>
      </div>

      {/* LIVE RATES + CHART */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border">
          {rates.map((rate) => (
            <div key={rate.id} className="flex justify-between p-5 border-b">
              <span className="text-lg font-bold">
                {rate.flag} {rate.pair}
              </span>
              <span className="font-mono font-bold">{rate.price.toFixed(4)}</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border">
          <ResponsiveContainer width="100%" height={400}>
          <BarChart
  layout="vertical"
  data={rates}
  margin={{ left: 10 }}
>

              <XAxis type="number" hide />
              <YAxis
  dataKey="pair"
  type="category"
  width={90}               // ✅ THIS fixes cutting
  tick={{
    fill: isDark ? "#e5e7eb" : "#374151",
    fontSize: 13,
    fontWeight: 600,
  }}
  axisLine={false}
  tickLine={false}
/>

              <Tooltip cursor={false}
  contentStyle={{
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#ffffff' : '#000000',
    borderRadius: '8px',
    border: 'none'
  }}
  itemStyle={{ color: isDark ? '#ffffff' : '#000000' }}/>
              <Bar
  dataKey="price"
  isAnimationActive
  animationDuration={600}
  animationEasing="ease-out"
>
  {rates.map((rate) => (
    <Cell
      key={rate.id}
      fill={getBarColor(rate.price)}
    />
  ))}

  {/* 🔢 VALUE LABELS AT BAR END */}
  <LabelList
    dataKey="price"
    position="right"
    formatter={(value) => value.toFixed(4)}
    style={{
      fill: isDark ? "#e5e7eb" : "#111827",
      fontSize: 12,
      fontWeight: 600,
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
