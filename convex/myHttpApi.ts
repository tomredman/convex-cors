import { httpAction } from "./_generated/server";

const API_URL = "https://api.api-ninjas.com/v1/facts";
const API_KEY = "P9nis6bPQQRNLyrFK/yPaw==VJczzEp4moLZHGrk"; // Replace with your actual API key

export const getRandomFact = httpAction(async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    return response;
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: `Internal Server Error: ${error.message}` }),
      {
        status: 500,
      }
    );
  }
});
