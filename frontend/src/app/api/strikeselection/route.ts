// app/api/strike-selector/route.ts

import { NextResponse } from "next/server";
import { erf } from "mathjs";
import fetch from "node-fetch";

// Normal distribution helpers
function normCdf(x: number) {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}
function normPdf(x: number) {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

// Black-Scholes pricing and greeks
function bsmPriceAndGreeks(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  optionType: "call" | "put"
): [number, number, number] {
  if (T <= 0 || sigma <= 0) {
    const intrinsic = Math.max(0, optionType === "call" ? S - K : K - S);
    return [intrinsic, 0, 0];
  }
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  let price: number, delta: number;
  if (optionType === "call") {
    price = S * normCdf(d1) - K * Math.exp(-r * T) * normCdf(d2);
    delta = normCdf(d1);
  } else {
    price = K * Math.exp(-r * T) * normCdf(-d2) - S * normCdf(-d1);
    delta = -normCdf(-d1);
  }
  const gamma = normPdf(d1) / (S * sigma * Math.sqrt(T));
  return [price, delta, gamma];
}

export async function POST(req: Request) {
  const {
    capital,
    riskLimit,
    spotTarget,
    spotSL,
    expiry,
    currentTime,
    lotSize,
    optionType,
    instrumentKey,
  } = await req.json();


  const hitTimeMs = new Date(currentTime).getTime() + 180 * 60 * 1000; // +3 hours
  const T = (new Date(expiry).getTime() - hitTimeMs) / (365 * 24 * 60 * 60 * 1000);
  const r = 0.065;

  const API_BASE = process.env.UPSTOX_API_BASE!;
  const API_KEY = process.env.UPSTOX_API_KEY!;
  const API_SECRET = process.env.UPSTOX_API_SECRET!;

  const resp = await fetch(
    `${API_BASE}/option-chain?instrument_key=${instrumentKey}&expiry_date=${expiry}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}:${API_SECRET}`,
      },
    }
  );
  if (!resp.ok)
    return NextResponse.json({ error: "Failed to fetch option chain" }, { status: 500 });

  const json = await resp.json() as {
    data: {
      strike_price: number;
      call_ltp: number;
      put_ltp: number;
      call_vega: number;
      put_vega: number;
    }[];
  };
  const rows = json.data.map((o: any) => ({
    strike: o.strike_price,
    ltp: optionType === "call" ? o.call_ltp : o.put_ltp,
    vega: optionType === "call" ? o.call_vega : o.put_vega,
  }));

  const computed: any[] = [];
  for (const { strike, ltp, vega } of rows) {
    const S = strike;
    const L = ltp;
    const iv = (vega / 100) || 0.15;

    const [targetPrice, delta, gamma] = bsmPriceAndGreeks(spotTarget, S, T, r, iv, optionType);
    const [slPrice] = bsmPriceAndGreeks(spotSL, S, T, r, iv, optionType);

    const capPerLot = L * lotSize;
    if (capPerLot <= 0) continue;

    computed.push({
      Strike: S,
      LTP: L,
      TargetPremium: targetPrice,
      SLPremium: slPrice,
      Delta: delta,
      Gamma: gamma,
      ProfitPercent: ((targetPrice - L) * lotSize / capPerLot) * 100,
      LossPercent: ((L - slPrice) * lotSize / capPerLot) * 100,
      Efficiency: (targetPrice - L) / capPerLot,
    });
  }

  const selected = computed
    .filter(c => c.ProfitPercent > 0 && c.LossPercent > 0)
    .sort((a, b) => b.Efficiency - a.Efficiency)
    .slice(0, 5);

  return NextResponse.json({ computed, selected });
}
