"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CoinDetail({ params }) {
  const { id } = use(params);
  
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  
  /* ---------- THEME SYNC (LIVE) ---------- */
  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const res = await fetch("/api/crypto");
        const data = await res.json();
        const found = data.find(c => c.id === id);

        if (found && active) {
          setCoin({
            name: found.name,
            symbol: found.symbol.toUpperCase(),
            priceUsd: found.current_price,
            change24: found.price_change_percentage_24h,
            marketCap: found.market_cap,
            volume: found.total_volume,
            image: found.image,
          });
        }

        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
        );
        const chartJson = await chartRes.json();

        if (chartJson?.prices && active) {
          setChartData(
            chartJson.prices.map(p => ({
              day: new Date(p[0]).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              price: p[1],
            }))
          );
        }
      } catch (e) {
        console.error("Failed to load coin data");
      } finally {
        active && setLoading(false);
      }
    }

    loadData();
    return () => (active = false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="h-40 bg-white dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const isPositive = coin.change24 >= 0;
  const sentiment = isPositive
    ? "Bullish (Buy Trend)"
    : "Bearish (Sell Pressure)";

  /* ---------- HIGH / LOW POINTS ---------- */
  const prices = chartData.map(d => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  return (
    <div
  className="
    min-h-screen pt-10
    bg-gradient-to-b
    from-slate-50 to-white
    dark:from-[#020617] dark:to-[#020617]
    text-gray-900 dark:text-gray-100
  "
>

      <div className="max-w-4xl mx-auto">

        <Link href="/" className="text-gray-500 hover:text-black dark:hover:text-white mb-6 inline-flex items-center gap-2 font-medium">
          ← Back to Live Dashboard
        </Link>

        <div className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">

          {/* HEADER */}
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
            <div className="flex items-center gap-6">
              <img src={coin.image} alt={coin.name} className="w-16 h-16" />
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold">{coin.name}</h1>
                <span className="text-gray-400 font-mono">{coin.symbol}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl md:text-4xl font-extrabold">
                ${coin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-lg ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? "▲" : "▼"} {Math.abs(coin.change24).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* PRICE TREND */}
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              7 Day Price Trend
            </h3>

            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDark ? 0.5 : 0.7} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* CROSSHAIR + SMOOTH TOOLTIP */}
                  <Tooltip
                    isAnimationActive
                    animationDuration={250}
                    cursor={{
                      stroke: isDark ? "#334155" : "#94a3b8",
                      strokeDasharray: "3 3",
                    }}
                    contentStyle={{
                      backgroundColor: isDark ? "#020617" : "#f8fafc",
                      color: isDark ? "#e5e7eb" : "#111827",
                      borderRadius: "10px",
                      border: "1px solid",
                      borderColor: isDark ? "#1e293b" : "#e5e7eb",
                      boxShadow: isDark
                        ? "0 10px 30px rgba(0,0,0,0.6)"
                        : "0 10px 30px rgba(0,0,0,0.15)",
                    }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.day || ""
                    }
                    formatter={(v) => [`$${v.toFixed(2)}`, "Price"]}
                  />

                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                    dot={({ cx, cy, payload }) =>
                      payload.price === maxPrice || payload.price === minPrice ? (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={payload.price === maxPrice ? "#22c55e" : "#ef4444"}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ) : null
                    }
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SENTIMENT */}
          <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
            <div className={`p-4 rounded-lg border border-dashed ${
              isPositive
                ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                : "border-red-300 bg-red-50 dark:bg-red-900/20"
            }`}>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Market Sentiment
              </h3>
              <p className={`text-2xl font-bold ${
                isPositive ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
              }`}>
                {sentiment}
              </p>
            </div>
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 dark:bg-gray-700">
            <div className="bg-white dark:bg-gray-800 p-6">
              <p className="text-sm text-gray-400 uppercase">Market Cap</p>
              <p className="text-2xl font-bold">${(coin.marketCap / 1e9).toFixed(2)}B</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6">
              <p className="text-sm text-gray-400 uppercase">Volume (24h)</p>
              <p className="text-2xl font-bold">${(coin.volume / 1e9).toFixed(2)}B</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
