import OpenAI from "https://deno.land/x/openai@v4.69.0/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});

// CORS headers for responses to requests from browser
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Replace '*' with your domain for more security
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Adjust methods as needed
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      "name": "addMapPins",
      "description": "Put pins on a Google Maps interface in the same window",
      "strict": true,
      "parameters": {
        "type": "object",
        "required": [
          "locations",
        ],
        "properties": {
          "locations": {
            "type": "array",
            "description": "Array of pin locations to be added on the map",
            "items": {
              "type": "object",
              "properties": {
                "key": {
                  "type": "string",
                  "description": "Unique name of the location",
                },
                "location": {
                  "type": "object",
                  "properties": {
                    "lat": {
                      "type": "number",
                      "description": "Latitude coordinate for the pin",
                    },
                    "lng": {
                      "type": "number",
                      "description": "Longitude coordinate for the pin",
                    },
                  },
                  "required": ["lat", "lng"],
                  "additionalProperties": false,
                },
              },
              "required": ["key", "location"],
              "additionalProperties": false,
            },
          },
        },
        "additionalProperties": false,
      },
    },
  },
];

Deno.serve(async (req) => {
  // Handle OPTIONS request (preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { messages } = await req.json();

    let completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools,
    });

    console.log(completion.choices[0].message);

    const toolCalls = completion.choices[0].message.tool_calls;

    // If no need to add pins to map, return the message content
    if (!toolCalls || toolCalls.length === 0) {
      return new Response(
        JSON.stringify({ message: completion.choices[0].message.content }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // If need to add pins to map, send pin locations to client
    const toolCall = toolCalls[0];
    const toolArgs = toolCall.function.arguments;

    // Create message simulating result of function call
    const fnCallResultMessage = {
      role: "tool",
      content: JSON.stringify({ locations: toolArgs }),
      tool_call_id: toolCall.id,
    };

    // Simulate response after calling tool
    completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...messages,
        completion.choices[0].message,
        fnCallResultMessage,
      ],
    });

    return new Response(
      JSON.stringify({
        message: completion.choices[0].message.content,
        locations: toolArgs,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
