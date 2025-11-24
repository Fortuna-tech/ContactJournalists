import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MODEL = "gpt-5-chat-latest";

const EMAIL_TEMPLATE = `
Hi {First Name},

I’m reaching out because I thought this story might be a strong fit for your coverage of {their beat/topic}. {Optional: 1 sentence referencing a recent article of theirs to show relevance}.

{1–2 sentence news hook}
What’s new, timely, or surprising? Why now?

{1–2 sentence core story angle}
What’s the essence of the story, and why does it matter to their audience?

Supporting detail:
{1–2 brief bullets with data points, insights, or authoritative credibility}
{Optional: A micro-quote or soundbite from an expert/spokesperson}

I can offer {interview with X / embargoed access / exclusive data / early look at the report}, if helpful.

Would you be interested in {next step—interview, full report, data, etc.}?

Thanks for your time,

{Your Name}
{Title / Organization, if relevant}
{Email + phone (optional)}
{Link to additional resources, if appropriate}
`;

// Helper function to fetch website content
async function fetchWebsiteContent(url: string) {
  try {
    console.log(`Fetching content from: ${url}`);
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; JournalistNetworkBot/1.0; +http://journalistnetwork.com)",
      },
    });
    if (!response.ok) {
      return `Failed to fetch content. Status: ${response.status}`;
    }
    const html = await response.text();
    // Basic text extraction: remove scripts, styles, and tags
    const text = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 3000); // Limit to 3000 chars
    return text;
  } catch (error) {
    return `Error fetching website: ${error.message}`;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { beat, businessInfo, websiteUrl, additionalInfo } = await req.json();

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const tools = [
      {
        type: "function",
        function: {
          name: "fetch_website",
          description:
            "Fetches the text content of a website URL to gather context about a business, story, or brand.",
          parameters: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "The full URL to fetch (e.g. https://example.com)",
              },
            },
            required: ["url"],
          },
        },
      },
    ];

    const systemPrompt = `You are an expert PR strategist and copywriter. 
    Your goal is to write a compelling, concise, and effective press pitch email for a journalist using the provided template.
    
    Template to use (strictly follow this structure):
    ${EMAIL_TEMPLATE}
    
    Instructions:
    1. Replace placeholders like {First Name}, {their beat/topic} with specific info if available, or keep generic placeholders like "[Journalist Name]" if unknown.
    2. For the "news hook", "core story angle", and "supporting detail", generate high-quality, persuasive content based on the user's business info.
    3. Tone: Professional, personalized, and respectful.
    4. If the user provides a URL or brand name, use the 'fetch_website' tool to get more context if you need it.
    5. If a brand name is provided without a URL, ask the tool to fetch the likely URL if you can guess it, or just use the name.
    
    Format the final output as JSON with two fields: "subject" and "body".`;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `
        Generate a press pitch based on the following details:
        Target Beat/Topic: ${beat}
        Business/Story Info: ${businessInfo}
        ${websiteUrl ? `Website URL: ${websiteUrl}` : ""}
        ${additionalInfo ? `Additional Context: ${additionalInfo}` : ""}
        
        If I provided a URL, please fetch it to get details. If I mentioned a brand name but no URL, try to find info about it if possible.
        `,
      },
    ];

    // First call to OpenAI (can decide to use tools)
    const runner = await openai.chat.completions.create({
      model: MODEL,
      messages: messages as any,
      tools: tools as any,
      tool_choice: "auto",
      response_format: { type: "json_object" },
    });

    let finalResponse = runner;
    const message = runner.choices[0].message;

    // Handle tool calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      messages.push(message); // Add the assistant's tool call request to history

      for (const toolCall of message.tool_calls) {
        if (toolCall.function.name === "fetch_website") {
          const args = JSON.parse(toolCall.function.arguments);
          console.log(`Tool call: fetching ${args.url}`);
          const content = await fetchWebsiteContent(args.url);

          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: "fetch_website",
            content: content,
          });
        }
      }

      // Second call to OpenAI with tool outputs
      finalResponse = await openai.chat.completions.create({
        model: MODEL,
        messages: messages as any,
        response_format: { type: "json_object" },
      });
    }

    const result = JSON.parse(finalResponse.choices[0].message.content || "{}");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
