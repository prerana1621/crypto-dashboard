"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  /* ---------- THEME SYNC ---------- */
  useEffect(() => {
    const updateTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    fetch("/api/crypto")
      .then((res) => res.json())
      .then((data) => {
        setCoins(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("cryptoFavorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("cryptoFavorites", JSON.stringify(updated));
  };

  const filteredCoins = coins.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-400 bg-gray-50 dark:bg-gray-900">
        Loading live crypto market…
      </div>
    );
  }

  const tooltipBg = isDark ? "#020617" : "#ffffff";
  const tooltipText = isDark ? "#e5e7eb" : "#0f172a";
  const tooltipBorder = isDark
    ? "1px solid rgba(148,163,184,0.25)"
    : "1px solid rgba(15,23,42,0.15)";

  const cursorFill = isDark
    ? "rgba(148,163,184,0.18)"
    : "rgba(100,116,139,0.12)";

  return (
    <div className="
  min-h-screen
  bg-gradient-to-b
  from-slate-50 to-white
  dark:from-[#020617] dark:to-[#020617]
  text-gray-900 dark:text-gray-100
">

      {/* HERO */}
      <section className="pt-8 pb-4 px-4 sm:px-6 text-center">
      <h1
  style={{ textRendering: "optimizeLegibility" }}
  className="
    text-[32px] md:text-[36px]
    font-extrabold
    leading-[1.2]
    pb-2
    tracking-tight
    bg-clip-text text-transparent
    bg-gradient-to-r
    from-[#5b6cff] via-[#6b5cff] to-[#7c4dff]
    dark:from-[#6a7cff] dark:via-[#7b6cff] dark:to-[#9b6cff]
    drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]
dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]

  "
>
  CryptoMarket Sim
</h1>

<div
className="
  mt-2 mb-5 inline-flex items-center gap-2
  px-5 py-2 rounded-full
  text-sm font-semibold

  /* Light mode */
  bg-blue-50 text-blue-600
  border border-blue-200

  /* Dark mode — NAVY / GLASS */
  dark:bg-[#0a1530]
  dark:text-blue-400
  dark:border-blue-400/20
  dark:backdrop-blur-md
  dark:shadow-[0_0_24px_rgba(99,102,241,0.25)]
"
>
● Live Crypto Simulator
</div>
</section>

      {/* SEARCH */}
      <section className="px-4 sm:px-6 mb-5">
        <input
          type="text"
          placeholder="Search cryptocurrency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
  w-full max-w-5xl mx-auto block p-4 rounded-xl
  bg-white dark:bg-[#0b1220]
  border border-gray-300 dark:border-white/10
  placeholder-gray-500 dark:placeholder-gray-400
  caret-gray-900 dark:caret-gray-100
  shadow-sm focus:shadow-md
  focus:ring-2 focus:ring-blue-500 outline-none
"
        />
      </section>

      {/* CHART */}
      <section className="px-4 sm:px-6 mb-10">
        <div className="max-w-5xl mx-auto h-[340px]
                        bg-white dark:bg-[#0b1220]
                        border border-gray-200 dark:border-white/10
                        rounded-2xl shadow-md
                        dark:shadow-[0_0_35px_rgba(99,102,241,0.12)]
                        p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            24H Price Change (%)
          </h2>
          <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-3" />

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredCoins.slice(0, 10)}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
              <XAxis
                dataKey="symbol"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: cursorFill }}
                contentStyle={{ backgroundColor: tooltipBg, borderRadius: "12px", border: tooltipBorder }}
                itemStyle={{ color: tooltipText }}
                labelStyle={{ color: "#94a3b8", fontWeight: 600 }}
              />
              <Bar dataKey="price_change_percentage_24h" radius={[8, 8, 8, 8]}>
                {filteredCoins.slice(0, 10).map((coin, i) => (
                  <Cell key={i} fill={coin.price_change_percentage_24h >= 0 ? "#22c55e" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* LIST */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-3">
          {filteredCoins.map((coin) => (
            <Link key={coin.id} href={`/coin/${coin.id}`}>
              <div className="p-4 bg-white dark:bg-[#0b1220]
                            border border-gray-200 dark:border-white/10
                            rounded-xl flex justify-between items-center
                            shadow-sm
                            hover:shadow-xl hover:-translate-y-1 
                            transition-all duration-300 ease-in-out">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(coin.id);
                    }}
                    className="text-2xl text-yellow-400"
                  >
                    {favorites.includes(coin.id) ? "★" : "☆"}
                  </button>
                  <img src={coin.image} className="w-10 h-10" />
                  <div>
                    <h3 className="font-bold">{coin.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {coin.symbol}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${coin.current_price.toLocaleString()}</p>
                  <p className={`flex items-center justify-end gap-1 font-medium ${
                    coin.price_change_percentage_24h >= 0 
                      ? "text-green-500 dark:text-green-400" 
                      : "text-red-500 dark:text-red-400"
                  }`}>
                    {coin.price_change_percentage_24h >= 0 ? (
                      <span className="text-[10px]">▲</span> 
                    ) : (
                      <span className="text-[10px]">▼</span> 
                    )}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        </section>
    </div>
  );
}
