import { schema } from "./chat_POST.schema";
import { assembleUserContext } from "../../helpers/assembleUserContext";
import superjson from 'superjson';
import { handleEndpointError } from "../../helpers/endpoint";

export async function handle(request: Request) {
  return new Response(
    superjson.stringify({ error: "AI features are disabled in the MVP." }),
    { status: 410 },
  );
  try {
    const json = await request.json();
    const { message, conversationHistory } = schema.parse(json);

    const context = await assembleUserContext();

    const systemPrompt = `You are Tell Doug, a helpful AI assistant for career management. 
    You have access to the user's career data including people, jobs, skills, projects, interactions, feedback, achievements, goals, compensation, events, institutions, and relationships. 
    
    Here is the user's current data context:
    ${context}
    
    Help them query and understand their career data. Be concise, friendly, and helpful. 
    If the user asks about something not in the context, politely say you don't have that information.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message },
    ];

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        stream: true,
      }),
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      console.error("OpenAI API Error:", errorText);
      return new Response(superjson.stringify({ error: "Failed to communicate with AI service" }), { status: 500 });
    }

    // Create a transform stream to process the SSE chunks from OpenAI
    const stream = new ReadableStream({
      async start(controller) {
        const reader = openAiResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine.startsWith("data: ")) continue;
              
              const data = trimmedLine.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (e) {
                console.error("Error parsing stream chunk", e);
              }
            }
          }
        } catch (e) {
          console.error("Stream reading error", e);
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Chat endpoint error:", error);
    return handleEndpointError(error);
  }
}
