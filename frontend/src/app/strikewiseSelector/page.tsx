// frontend/src/app/strikewiseSelector/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNavbar from "@/components/layout/site-navbar";
import StrikeWiseGraph from "@/components/ui/StrikeWiseGraph";
import { Projection, SelectedContract } from "@/components/types/types";

export default function StrikeWiseSelector() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Removed userName and userEmail states here, as SiteNavbar will handle them directly.
  // The logic for checking authentication (isAuthenticated) and redirecting remains.

  const [instrument, setInstrument] = useState("NSE_INDEX|Nifty 50");
  const [expiry, setExpiry] = useState("2025-06-20");
  const [capital, setCapital] = useState<number | "">("");
  const [spotTargetGain, setSpotTargetGain] = useState<number | "">("");
  const [spotSLLoss, setSpotSLLoss] = useState<number | "">("");
  const [riskTolerance, setRiskTolerance] = useState<number | "">("");
  const [minutesToTarget] = useState<number>(180);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    projections: Projection[];
    selected_contracts: SelectedContract[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"graph" | "target">("graph");
  const [optionType, setOptionType] = useState<"CE" | "PE">("CE");

  // Effect to check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleGenerate = async () => {
    if (
      capital === "" ||
      spotTargetGain === "" ||
      spotSLLoss === "" ||
      riskTolerance === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert("You are not authenticated. Please log in.");
      router.push('/login');
      setLoading(false);
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        alert("Backend URL is not configured.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${backendUrl}/api/strikewise/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          instrument_key: instrument,
          expiry_date: expiry,
          spot_target_gain: Number(spotTargetGain),
          spot_sl_loss: Number(spotSLLoss),
          capital: Number(capital),
          risk_tolerance: Number(riskTolerance),
          minutes_to_hit_target: minutesToTarget,
          option_type: optionType,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        alert("Your session has expired or is invalid. Please log in again.");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data = await res.json();
      setResult(data);
      console.log("API result:", data);
    } catch (error) {
      console.error("Error generating strategy:", error);
      alert("Failed to generate strategy. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const renderProjections = () => {
    if (!result?.projections?.length) {
      return <div>No projections available.</div>;
    }

    return (
      <div className="overflow-auto max-h-[400px]">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 dark:bg-neutral-800 sticky top-0">
            <tr>
              {Object.keys(result.projections[0]).map((col) => (
                <th key={col} className="px-2 py-1 border">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.projections.map((item, i) => (
              <tr key={i} className="border-b">
                {Object.values(item).map((val, j) => (
                  <td key={j} className="px-2 py-1">{String(val)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSelectedContracts = () => {
    if (!result?.selected_contracts?.length) return null;

    return (
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-4">
          📌 Selected Contracts
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.selected_contracts.map((contract, i) => (
            <div
              key={i}
              className="border border-green-300 dark:border-green-700 rounded-md p-4 bg-green-50 dark:bg-green-900 shadow-sm text-sm"
            >
              <div className="font-bold text-green-900 dark:text-green-100 mb-1">
                Strike: {contract.Strike}
              </div>
              <div className="text-gray-800 dark:text-gray-200 space-y-1">
                <div>Lots: {contract.Lots}</div>
                <div>Total Cost: ₹{contract.Total_Cost.toFixed(2)}</div>
                <div>Total Reward: ₹{contract.Total_Reward.toFixed(2)}</div>
                <div>Total Risk: ₹{contract.Total_Risk.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Display a loading/redirecting message if not authenticated yet
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-neutral-950 text-gray-800 dark:text-white">
        <p>Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white dark:bg-neutral-950 text-gray-800 dark:text-white">
      {/* SiteNavbar now does not need userName or userEmail props */}
      <SiteNavbar />

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-20">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Strikewise: <span className="text-blue-600">Option Strike Picker</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Form */}
          <div className="lg:w-1/3 w-full border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm bg-white dark:bg-neutral-900 space-y-4">
            <h2 className="text-lg font-medium mb-2">Strategy Inputs</h2>

            <div>
              <label className="block text-sm mb-1">Option Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="optionType"
                    value="CE"
                    checked={optionType === "CE"}
                    onChange={() => setOptionType("CE")}
                    className="accent-blue-600"
                  />
                  CE (Call)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="optionType"
                    value="PE"
                    checked={optionType === "PE"}
                    onChange={() => setOptionType("PE")}
                    className="accent-blue-600"
                  />
                  PE (Put)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Instrument</label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:text-white"
              >
                <option value="NSE_INDEX|Nifty 50">NIFTY</option>
                <option value="NSE_INDEX|Bank Nifty">BANKNIFTY</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Expiry</label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Available Capital (₹)</label>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Target Gain (pts)</label>
              <input
                type="number"
                value={spotTargetGain}
                onChange={(e) => setSpotTargetGain(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Stop Loss (pts)</label>
              <input
                type="number"
                value={spotSLLoss}
                onChange={(e) => setSpotSLLoss(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Risk Tolerance (₹)</label>
              <input
                type="number"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Strategy"}
            </button>
          </div>

          {/* Right Panel: Output */}
          <div className="lg:w-2/3 w-full relative">
            <div className="absolute -top-10 right-0 flex gap-2 z-10">
              <button
                className={`px-4 py-2 rounded-t-md border border-b-0 transition
                  ${activeTab === "graph"
                    ? "bg-gray-50 dark:bg-neutral-900 text-blue-600 border-gray-200 dark:border-neutral-800"
                    : "bg-white dark:bg-neutral-950 text-gray-600 border-transparent"}`}
                onClick={() => setActiveTab("graph")}
              >
                Show Graph
              </button>
              <button
                className={`px-4 py-2 rounded-t-md border border-b-0 transition
                  ${activeTab === "target"
                    ? "bg-gray-50 dark:bg-neutral-900 text-green-600 border-gray-200 dark:border-neutral-800"
                    : "bg-white dark:bg-neutral-950 text-gray-600 border-transparent"}`}
                onClick={() => setActiveTab("target")}
              >
                List Target Prices
              </button>
            </div>

            <div className="border border-gray-200 dark:border-neutral-800 rounded-t-none rounded-b-lg p-6 bg-gray-50 dark:bg-neutral-900 min-h-[250px] h-full">
              {activeTab === "graph" ? (
                result?.projections?.length ? (
                  <div className="overflow-x-auto">
                    <div className="w-[1200px] max-w-full">
                      <StrikeWiseGraph projections={result.projections} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    No data to plot
                  </div>
                )
              ) : (
                renderProjections()
              )}

              {renderSelectedContracts()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}