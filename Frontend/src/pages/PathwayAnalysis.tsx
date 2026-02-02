import { useState } from "react";
import { predictDecision } from "@/lib/api";

export default function PathwayAnalysis() {
  const [age, setAge] = useState(20);
  const [score, setScore] = useState(70);
  const [income, setIncome] = useState(30000);

  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await predictDecision({ age, score, income });
      setResult(res.prediction);
    } catch (err) {
      setError("Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md space-y-4">
      <h1 className="text-xl font-bold">Decision Predictor</h1>

      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        placeholder="Age"
        className="border p-2 w-full"
      />

      <input
        type="number"
        value={score}
        onChange={(e) => setScore(Number(e.target.value))}
        placeholder="Score"
        className="border p-2 w-full"
      />

      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(Number(e.target.value))}
        placeholder="Income"
        className="border p-2 w-full"
      />

      <button
        onClick={handlePredict}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Predicting..." : "Predict"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {result !== null && (
        <p className="text-green-600">
          Prediction result: <b>{result}</b>
        </p>
      )}
    </div>
  );
}
