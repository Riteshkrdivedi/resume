export async function GET(req) {
  const apiKey = process.env.OPENAI_API_KEY;

  return new Response(
    JSON.stringify({
      message: `Test route working. API Key is: ${apiKey}`,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
