import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an unbiased, expert career and immigration decision-support system called Global Pathways AI. Your role is to help users decide whether they should work or study locally in their current country, or pursue opportunities abroad.

You must analyze the user's profile objectively and provide:
1. A clear final recommendation
2. A confidence score (0-100) based on how well the user's profile matches the recommended pathway
3. A detailed comparison of local vs abroad options
4. Clear reasoning points explaining your recommendation
5. 3 alternative pathways with their pros and cons

Be realistic about visa challenges, costs, and timelines. Consider the user's:
- Age and current career stage
- Financial constraints and loan willingness
- Stability preferences and risk tolerance
- Permanent residency goals
- Time horizon
- Preferred destination countries

Your response MUST be valid JSON matching this exact schema:
{
  "final_recommendation": "string - A clear, actionable recommendation (e.g., 'Pursue Master's degree in Canada' or 'Build career locally for 2-3 years first')",
  "confidence_score": number (0-100),
  "local_vs_abroad_comparison": {
    "local": {
      "pros": ["string array of advantages"],
      "cons": ["string array of disadvantages"],
      "estimated_timeline": "string (e.g., '1-2 years to reach goals')",
      "estimated_cost": "string (e.g., '$5,000-$10,000')"
    },
    "abroad": {
      "pros": ["string array of advantages"],
      "cons": ["string array of disadvantages"],
      "estimated_timeline": "string",
      "estimated_cost": "string"
    }
  },
  "reasoning_points": ["string array - 4-6 key reasons for your recommendation"],
  "alternate_pathways": [
    {
      "path": "string - Description of alternative pathway",
      "pros": ["string array"],
      "cons": ["string array"]
    }
  ]
}

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation text outside the JSON.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile } = await req.json();

    if (!userProfile) {
      return new Response(
        JSON.stringify({ error: "User profile is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    console.log("gemini called");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userPrompt = `Analyze this user profile and provide a pathway recommendation:

User Profile:
- Age Range: ${userProfile.age}
- Current Country: ${userProfile.country}
- Current Status: ${userProfile.currentStatus}
- Field/Industry: ${userProfile.field}
- Target Annual Income: ${userProfile.incomeGoal}
- Permanent Residency Goal: ${userProfile.prGoal}
- Stability Preference: ${userProfile.stabilityPreference}
- Time Horizon: ${userProfile.timeHorizon}
- Available Savings: ${userProfile.savingsRange}
- Willing to Take Loan: ${userProfile.willingToTakeLoan ? "Yes" : "No"}
- Visa Risk Tolerance: ${userProfile.visaRiskTolerance}
- Preferred Countries: ${userProfile.preferredCountries.join(", ")}

Based on this profile, provide your analysis as a JSON response following the exact schema specified.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: userPrompt }]
          }],
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI service quota exceeded. Please try again later.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze pathway" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );andidates?.[0]?.content?.parts?.[0]?.tex
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Failed to generate recommendation" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the JSON response - handle potential markdown code blocks
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7);
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", cleanedContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI recommendation" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate the response structure
    if (
      !parsedResult.final_recommendation ||
      typeof parsedResult.confidence_score !== "number" ||
      !parsedResult.local_vs_abroad_comparison ||
      !parsedResult.reasoning_points ||
      !parsedResult.alternate_pathways
    ) {
      console.error("Invalid AI response structure:", parsedResult);
      return new Response(
        JSON.stringify({ error: "AI response format is invalid" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(parsedResult), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Pathway decision error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
