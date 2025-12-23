import { NextResponse } from "next/server";

// Parse Stooq compact CSV (NO HEADERS)
function parseStooqCSV(csv) {
  const line = csv.trim().split("\n")[0];
  const parts = line.split(",");

  // Safety check
  if (parts.length < 8) return null;

  return {
    symbol: parts[0],
    date: parts[1],
    time: parts[2],
    open: Number(parts[3]),
    high: Number(parts[4]),
    low: Number(parts[5]),
    close: Number(parts[6]),
    volume: Number(parts[7])
  };
}

export async function GET() {
  try {
    console.log("/api/stocks called");

    const stocks = [
      { id: "aapl", symbol: "AAPL.US", name: "Apple Inc." },
      { id: "msft", symbol: "MSFT.US", name: "Microsoft" },
      { id: "tsla", symbol: "TSLA.US", name: "Tesla" }
    ];

    const results = [];

    for (const stock of stocks) {
      const res = await fetch(
        `https://stooq.com/q/l/?s=${stock.symbol.toLowerCase()}&i=d`,
        { cache: "no-store" } 
      );

      const csv = await res.text();
      const parsed = parseStooqCSV(csv);

      if (!parsed) continue;

      results.push({
        id: stock.id,
        symbol: stock.symbol.split(".")[0],
        name: stock.name,
        price: parsed.close,
        change: ((parsed.close - parsed.open) / parsed.open) * 100,
        volume: parsed.volume
      });
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
