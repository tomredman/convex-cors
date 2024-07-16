import { httpAction } from "./_generated/server";
import { facts } from "./data/facts";

export const getFact = httpAction(async () => {
  const randomIndex = Math.floor(Math.random() * facts.length);
  const randomFact = facts[randomIndex];

  return new Response(JSON.stringify([{ fact: randomFact }]), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});
