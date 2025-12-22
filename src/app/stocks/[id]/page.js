"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

export default function StockDetail({ params }) {
  const { id } = use(params);

  const [stock, setStock] = useState(null);
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState(null);

  /* ---------- THEME SYNC ---------- */
  useEffect(() => {
    const sync = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  /* ---------- DATA FETCH ---------- */
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/stocks");
        if (!res.ok) throw new Error("Failed to load stocks");
        const list = await res.json();

        const found = list.find(s => s.id === id);
        if (!found) throw new Error("Stock not found");

        if (!active) return;
        setStock(found);

        const ohlcRes = await fetch(`/api/ohlc?id=${id}`);
        if (!ohlcRes.ok) throw new Error("Failed to load OHLC");

        const ohlc = await ohlcRes.json();
        setCandles(ohlc);
      } catch (e) {
        console.error(e);
        setError("Unable to load stock details");
      } finally {
        active && setLoading(false);
      }
    }

    load();
    return () => (active = false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Loading stock data…
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        {error || "Stock unavailable"}
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <div className="min-h-screen p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">

        <Link
          href="/stocks"
          className="text-gray-500 hover:text-black dark:hover:text-white mb-6 inline-flex"
        >
          ← Back to Stocks
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border overflow-hidden">

          {/* HEADER */}
          <div className="p-6 border-b dark:border-gray-700 flex justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">{stock.name}</h1>
              <p className="text-gray-400 font-mono">{stock.symbol}</p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold">${stock.price.toFixed(2)}</p>
              <p className={`font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "▲" : "▼"} {Math.abs(stock.change).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* CANDLE CHART */}
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-xs uppercase text-gray-500 mb-3">
              7-Day Candlestick Trend
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={candles}>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: isDark ? "#9ca3af" : "#374151" }}
                  />
                  <YAxis hide />

                  <Tooltip
  isAnimationActive
  animationDuration={200}
  cursor={{
    stroke: isDark ? "#475569" : "#94a3b8",
    strokeDasharray: "3 3",
  }}
  content={({ payload }) => {
    if (!payload || !payload.length) return null;

    const p = payload[0];
    const price =
      typeof p.value === "number"
        ? p.value
        : typeof p.payload?.price === "number"
        ? p.payload.price
        : null;

    const change =
      typeof p.payload?.change === "number" ? p.payload.change : null;

    const isUp = change !== null ? change >= 0 : null;

    return (
      <div
        style={{
          backgroundColor: isDark ? "#020617" : "#ffffff",
          borderRadius: "10px",
          border: `1px solid ${isDark ? "#1e293b" : "#e5e7eb"}`,
          boxShadow: isDark
            ? "0 10px 30px rgba(0,0,0,0.6)"
            : "0 10px 30px rgba(0,0,0,0.15)",
          padding: "10px 12px",
          color: isDark ? "#e5e7eb" : "#111827",
        }}
      >
        {price !== null && (
          <p className="text-sm font-semibold">
            ${price.toFixed(2)}
          </p>
        )}

        {change !== null && (
          <p
            className={`text-sm font-bold ${
              isUp ? "text-green-500" : "text-red-500"
            }`}
          >
            {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
          </p>
        )}
      </div>
    );
  }}
/>

                  {/* CANDLE BODIES */}
                  <Bar
                    dataKey="body"
                    shape={({ x, y, width, height, payload }) => {
                      const upColor = isDark ? "#22c55e" : "#16a34a";
                      const downColor = isDark ? "#ef4444" : "#dc2626";

                      return (
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={Math.max(height, 1)}
                          fill={payload.up ? upColor : downColor}
                          rx={1}
                        />
                      );
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* FUNDAMENTALS */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-400">Market Cap</span>
              <span className="font-bold">${(stock.marketCap / 1e9).toFixed(2)}B</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-400">Volume (24h)</span>
              <span className="font-bold">${(stock.volume / 1e6).toFixed(2)}M</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-400">Daily Change</span>
              <span className={`font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {stock.change.toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-400">Trend Confidence</span>
              <span className="font-bold text-blue-600">
                {Math.min(100, Math.abs(stock.change * 10)).toFixed(0)}%
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
