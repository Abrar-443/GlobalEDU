export async function predictDecision(data: {
  age: number;
  score: number;
  income: number;
}) {
  const response = await fetch("http://127.0.0.1:8001/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Prediction request failed");
  }

  return response.json();
}
