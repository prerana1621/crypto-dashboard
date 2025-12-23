import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = (searchParams.get("id") || "AAPL").toUpperCase();

    const stooqSymbol = `${symbol}.us`;

    const url = `https://stooq.com/q/d/l/?s=${stooqSymbol}&i=d`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch OHLC data" },
        { status: 500 }
      );
    }

    const csv = await res.text();
    const lines = csv.trim().split("\n");

    const data = lines.slice(-8).slice(0, 7).map(line => {
      const [date, open, high, low, close] = line.split(",");

      return {
        day: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        body: Math.abs(close - open),
        up: Number(close) >= Number(open),
      };
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("OHLC ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
