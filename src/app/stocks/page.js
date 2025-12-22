"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  // 📊 Market Insights
const avgPrice =
  stocks.reduce((sum, s) => sum + s.price, 0) / (stocks.length || 1);

const topGainer = [...stocks].sort((a, b) => b.change - a.change)[0];
const topLoser = [...stocks].sort((a, b) => a.change - b.change)[0];
const trendConfidence = Math.min(
  100,
  Math.abs(stocks.reduce((s, a) => s + a.change, 0))
).toFixed(0);

  // Detect dark mode from html class
  useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  // Fetch REAL stock data
  useEffect(() => {
    fetch("/api/stocks")
      .then(res => res.json())
      .then(data => {
        setStocks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Loading live stock market...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Wall Street Dashboard 🏙️
      </h1>
      {/* MARKET INSIGHTS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border shadow">
    <p className="text-xs text-gray-500 uppercase">Market Avg</p>
    <p className="text-2xl font-bold">${avgPrice.toFixed(2)}</p>
  </div>

  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border shadow">
    <p className="text-xs text-gray-500 uppercase">Top Gainer</p>
    <p className="text-xl font-bold text-green-500">
      {topGainer?.symbol} +{topGainer?.change.toFixed(2)}%
    </p>
  </div>

  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border shadow">
    <p className="text-xs text-gray-500 uppercase">Top Loser</p>
    <p className="text-xl font-bold text-red-500">
      {topLoser?.symbol} {topLoser?.change.toFixed(2)}%
    </p>
  </div>
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border shadow">
  <p className="text-xs text-gray-500 uppercase">Trend Confidence</p>
  <p className="text-2xl font-bold text-blue-500">
    {trendConfidence}%
  </p>
</div>

</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* MARKET CHART */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border h-80">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase">
            Market Trend
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stocks}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? "#555" : "#ccc"}
              />
              <XAxis
  dataKey="symbol"
  allowDuplicatedCategory={false}
  minTickGap={0}
  interval={0}
  tickFormatter={(value) => value}   // force render text
  angle={-45}
  textAnchor="end"
  height={60}
  tick={{
    fill: isDark ? "#9ca3af" : "#374151",
    fontSize: 12,
    fontWeight: 600,
  }}
  tickLine={false}
  axisLine={false}
/>

              <YAxis hide />
              <Tooltip
  isAnimationActive
  animationDuration={250}
  cursor={{
    stroke: isDark ? "#334155" : "#94a3b8",
    strokeDasharray: "3 3",
  }}
  contentStyle={{
    backgroundColor: isDark ? "#020617" : "#ffffff",
    color: isDark ? "#e5e7eb" : "#111827",
    borderRadius: "10px",
    border: "1px solid",
    borderColor: isDark ? "#1e293b" : "#e5e7eb",
    boxShadow: isDark
      ? "0 10px 30px rgba(0,0,0,0.6)"
      : "0 10px 30px rgba(0,0,0,0.15)",
  }}
  itemStyle={{ color: isDark ? "#e5e7eb" : "#111827" }}
/>

              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                fillOpacity={0.3}
                fill="#3b82f6"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border h-80 flex flex-col justify-center">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">
            Portfolio Distribution
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stocks}
                dataKey="price"
                nameKey="symbol"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {stocks.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip cursor={false}
  contentStyle={{
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#ffffff' : '#000000',
    borderRadius: '8px',
    border: 'none'
  }}
  itemStyle={{ color: isDark ? '#ffffff' : '#000000' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STOCK LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stocks.map(stock => (
  <Link key={stock.id} href={`/stocks/${stock.id}`}>
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border shadow cursor-pointer hover:shadow-lg transition">

            <h3 className="font-bold text-lg">{stock.symbol}</h3>
            <p className="text-xs text-gray-500">{stock.name}</p>
            <div className="text-2xl font-bold mt-2">
              ${stock.price.toFixed(2)}
            </div>
            <div
              className={`text-sm font-bold ${
                stock.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}%
            </div>
            </div>
  </Link>
))}

      </div>
    </div>
  );
}
