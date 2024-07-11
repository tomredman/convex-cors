import { httpAction } from "./_generated/server";

const API_URL = "https://api.api-ninjas.com/v1/facts";
const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key

export const getRandomFact = httpAction(async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch random fact` }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: `Internal Server Error: ${error.message}` }),
      {
        status: 500,
      }
    );
  }
});
