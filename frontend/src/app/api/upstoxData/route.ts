// app/api/upstox-data/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.UPSTOX_API_KEY!;
  const apiSecret = process.env.UPSTOX_API_SECRET!;

  // Example: Fetch option chain data
  const response = await fetch("https://api.upstox.com/v2/market-quote/option-chain", {
    method: "GET",
    headers: {
      "Api-Key": apiKey,
      "Api-Secret": apiSecret,
      // Add more headers if needed like Authorization Bearer
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
