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
  const [coins, setCoins] = useState([]);          // ✅ FIX
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);   // ✅ FIX
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
        setCoins(Array.isArray(data) ? data : []); // ✅ SAFETY
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ---------- FAVORITES ---------- */
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

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-400 bg-gray-50 dark:bg-gray-900">
        Loading live crypto market…
      </div>
    );
  }

  /* ---------- TOOLTIP COLORS ---------- */
  const tooltipBg = isDark ? "#020617" : "#ffffff";
  const tooltipText = isDark ? "#e5e7eb" : "#0f172a";
  const tooltipBorder = isDark
    ? "1px solid rgba(148,163,184,0.25)"
    : "1px solid rgba(15,23,42,0.15)";

  const cursorFill = isDark
    ? "rgba(148,163,184,0.18)"
    : "rgba(100,116,139,0.12)";

  return (
    <div className="min-h-screen px-4 sm:px-6 py-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Crypto Dashboard
        </h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search cryptocurrency…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-10 w-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* BAR CHART */}
        <div className="mb-12 h-80 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-4">
            24h Price Change (%)
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredCoins.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="symbol" tickLine={false} />
              <YAxis hide />

              <Tooltip
                cursor={{ fill: cursorFill }}
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderRadius: "12px",
                  border: tooltipBorder,
                }}
                itemStyle={{ color: tooltipText }}
                labelStyle={{
                  color: isDark ? "#94a3b8" : "#475569",
                  fontWeight: 600,
                }}
              />

              <Bar dataKey="price_change_percentage_24h">
                {filteredCoins.slice(0, 10).map((coin, i) => (
                  <Cell
                    key={i}
                    fill={
                      coin.price_change_percentage_24h >= 0
                        ? "#22c55e"
                        : "#ef4444"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 gap-3">
          {filteredCoins.map((coin) => (
            <Link key={coin.id} href={`/coin/${coin.id}`}>
              <div className="p-5 bg-white dark:bg-gray-800 border rounded-xl flex justify-between items-center hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(coin.id);
                    }}
                    className="text-2xl"
                  >
                    {favorites.includes(coin.id) ? "★" : "☆"}
                  </button>

                  <img src={coin.image} className="w-10 h-10" />
                  <div>
                    <h3 className="font-bold">{coin.name}</h3>
                    <span className="text-xs text-gray-400 uppercase">
                      {coin.symbol}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    ${coin.current_price.toLocaleString()}
                  </p>
                  <p
                    className={
                      coin.price_change_percentage_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
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
