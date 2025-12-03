import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, precedents } = await req.json();
    
    // Input validation
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (query.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Query must be under 5000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (precedents && !Array.isArray(precedents)) {
      return new Response(
        JSON.stringify({ error: 'Precedents must be an array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const precedentContext = precedents && precedents.length > 0
      ? `\n\nRelevant precedents found:\n${precedents.map((p: any) => `- ${p.title} (${p.citation}): ${p.summary}`).join('\n')}`
      : '';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a legal research expert analyzing Indian case law and precedents. Provide comprehensive analysis of legal queries with citations and principles.'
          },
          {
            role: 'user',
            content: `Legal Research Query: ${query}${precedentContext}\n\nProvide a detailed legal analysis including relevant principles, interpretations, and implications.`
          }
        ],
      }),
    });

    const data = await response.json();
    const insights = data.choices[0].message.content;

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred processing your request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});