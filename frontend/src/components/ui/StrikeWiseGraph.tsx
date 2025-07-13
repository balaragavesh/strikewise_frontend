"use client";

import dynamic from "next/dynamic";
import React from "react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Projection {
  Strike: number;
  Profit_Per_Lot: number;
  Loss_Per_Lot: number;
  OI?: number;
}

interface StrikeWiseGraphProps {
  projections: Projection[];
}

const StrikeWiseGraph: React.FC<StrikeWiseGraphProps> = ({ projections }) => {
  if (!projections || projections.length === 0) return <p>No data to display</p>;

  const clean = (val: number) => (isFinite(val) && !isNaN(val) ? val : 0);

  const strikePrices = projections.map((p) => p.Strike.toString());
  const profitPerLot = projections.map((p) => clean(p.Profit_Per_Lot));
  const lossPerLot = projections.map((p) => -Math.abs(clean(p.Loss_Per_Lot)));
  const openInterest = projections.map((p) => (p.OI ?? 0) / 100000); // in 000s

  return (
    <Plot
      data={[
        {
          x: strikePrices,
          y: profitPerLot,
          type: "bar",
          name: "Profit if Target Hit",
          marker: { color: "#16a34a" },
          yaxis: "y1",
          hovertemplate: "Strike: %{x}<br>Profit: ₹%{y}<extra></extra>",
        },
        {
          x: strikePrices,
          y: lossPerLot,
          type: "bar",
          name: "Loss if SL Hit",
          marker: { color: "#dc2626" },
          yaxis: "y1",
          hovertemplate: "Strike: %{x}<br>Loss: ₹%{y}<extra></extra>",
        },
        {
          x: strikePrices,
          y: openInterest,
          type: "scatter",
          mode: "lines+markers",
          name: "Open Interest (in 000s)",
          line: { color: "#3b82f6", width: 2 },
          marker: { size: 6 },
          yaxis: "y2",
          hovertemplate: "Strike: %{x}<br>OI: %{y}k<extra></extra>",
        },
      ]}
      layout={{
        title: "Profit/Loss and Open Interest vs Strike Price",
        barmode: "group",
        xaxis: {
          title: "Strike Price",
          tickangle: -45,
          type: "category",
        },
        yaxis: {
          title: "P&L per Lot (₹)",
          side: "left",
          showgrid: true,
          rangemode: "tozero",
        },
        yaxis2: {
          title: "Open Interest (in 000s)",
          side: "right",
          overlaying: "y",
          showgrid: false,
          rangemode: "tozero",
        },
        margin: {
          t: 60,
          r: 80,
          b: 100, // Increased bottom margin for X-axis tick visibility
          l: 60,
        },
        height: 550, // Slightly reduced height to avoid pushing contracts out
        legend: {
          orientation: "h",
          y: -0.2,
        },
        plot_bgcolor: "#f9fafb",
        paper_bgcolor: "#ffffff",
      }}
      config={{
        responsive: true,
        displaylogo: false,
      }}
      style={{ width: "100%" }}
    />
  );
};

export default StrikeWiseGraph;
