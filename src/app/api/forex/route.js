import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=USD",
      {
        next: { revalidate: 300 } // cache 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error("Frankfurter API failed");
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
