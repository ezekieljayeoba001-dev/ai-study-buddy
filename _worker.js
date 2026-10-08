export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const message = body.message;

        if (!message) {
          return Response.json(
            { error: "Message is required" },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "You are AI Study Buddy, a friendly and helpful AI tutor. Explain things clearly and simply. Help students learn step by step."
              },
              {
                role: "user",
                content: message
              }
            ]
          }
        );

        return Response.json({
          reply: result.response
        });

      } catch (error) {
        return Response.json(
          {
            error: "AI request failed",
            details: error.message
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
