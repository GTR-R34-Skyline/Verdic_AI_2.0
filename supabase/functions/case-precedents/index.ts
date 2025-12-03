import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseAbstract, caseId } = await req.json();

    if (!caseAbstract) {
      return new Response(
        JSON.stringify({ error: "Case abstract is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input length to prevent abuse
    if (typeof caseAbstract !== "string" || caseAbstract.length > 10000) {
      return new Response(
        JSON.stringify({ error: "Case abstract must be a string under 10000 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Use the user's JWT to respect RLS policies
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Fetch cases - RLS policies will be respected
    let query = supabase
      .from("cases")
      .select("id, case_number, title, description, case_type, status, priority, filing_date");
    
    if (caseId) {
      query = query.neq("id", caseId);
    }
    
    const { data: cases, error: casesError } = await query;

    if (casesError) {
      console.error("Supabase query error:", casesError);
      throw casesError;
    }

    if (!cases || cases.length === 0) {
      return new Response(
        JSON.stringify({ similar_cases: [], insights: "No cases found in database for comparison." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Lovable AI to find similar cases
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create a prompt that asks the AI to compare and rank cases by similarity
    const casesText = cases
      .map((c, idx) => `Case ${idx + 1} [${c.case_number}]: ${c.title}\n${c.description || "No description"}`)
      .join("\n\n");

    const prompt = `You are a legal AI assistant analyzing case similarity. Given the following case abstract:

"${caseAbstract}"

Compare it with these existing cases and identify the most similar ones:

${casesText}

For each case, analyze:
1. Thematic similarity (legal issues, subject matter)
2. Factual similarity (circumstances, parties involved)
3. Legal principles involved
4. Case type relevance

Return a JSON array of the top 5 most similar cases with this exact structure:
[
  {
    "case_index": <number>,
    "similarity_score": <float between 0-1>,
    "reasoning": "<brief explanation of why similar>"
  }
]

Only return the JSON array, no other text.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";

    // Parse AI response
    let similarityResults = [];
    try {
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        similarityResults = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Failed to parse AI response:", e);
    }

    // Map results back to cases
    const similarCases = similarityResults
      .filter((result: any) => result.case_index >= 1 && result.case_index <= cases.length)
      .map((result: any) => {
        const caseData = cases[result.case_index - 1];
        return {
          ...caseData,
          similarity_score: result.similarity_score,
          reasoning: result.reasoning,
        };
      })
      .sort((a: any, b: any) => b.similarity_score - a.similarity_score)
      .slice(0, 5);

    return new Response(
      JSON.stringify({ similar_cases: similarCases }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in case-precedents function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
