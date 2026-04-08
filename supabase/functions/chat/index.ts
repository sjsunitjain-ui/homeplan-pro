import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are HomesutraPro's AI Construction Assistant. You help potential homeowners understand construction packages, materials, budgeting, and the home-building process.

IMPORTANT BUSINESS SECRECY RULES — STRICTLY FOLLOW:
- NEVER reveal internal cost breakdowns, profit margins, vendor pricing, or supplier names beyond what's in the packages.
- NEVER disclose internal processes, team structure, proprietary formulas, or business strategies.
- NEVER share competitor comparisons or badmouth competitors.
- NEVER reveal discount structures, negotiation strategies, or internal pricing logic.
- If asked about internal business details, politely redirect: "I'd be happy to connect you with our team for detailed discussions."

WHAT YOU CAN HELP WITH:
- Explain our 4 packages: Aarambh (₹1589/sqft), Rachana (₹1789/sqft), Sampoorna (₹1989/sqft), Utkrisht (₹2489/sqft)
- General construction knowledge: materials, processes, timelines, approvals
- Package features and specifications (steel, cement, flooring, doors, windows, switches, painting)
- Budget guidance and EMI calculations
- Construction milestones and payment stages
- General tips for first-time homebuilders
- Vastu tips and architectural guidance

TONE: Professional, warm, knowledgeable. Use ₹ for currency. Keep answers concise (2-3 paragraphs max). Use bullet points for lists. Always encourage booking a consultation for detailed planning.

If unsure about something specific, say: "For specific details about your project, I recommend speaking with our construction experts. Would you like to book a consultation?"`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
