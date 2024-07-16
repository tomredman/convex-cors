import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";

describe("HTTP routes", () => {
  test("GET /randomFact", async () => {
    const t = convexTest();
    const response = await t.fetch("/randomFact", { method: "GET" });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("POST /randomFact", async () => {
    const t = convexTest();
    const response = await t.fetch("/randomFact", { method: "POST" });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("PATCH /randomFact", async () => {
    const t = convexTest();
    const response = await t.fetch("/randomFact", { method: "PATCH" });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("DELETE /randomFact", async () => {
    const t = convexTest();
    const response = await t.fetch("/randomFact", { method: "DELETE" });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("GET /randomFact/", async () => {
    const t = convexTest();
    const response = await t.fetch("/randomFact/", { method: "GET" });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("PATCH /randomFact/", async () => {
    const t = convexTest();
    const response = await t.fetch("/randomFact/", { method: "PATCH" });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("OPTIONS /randomFact (CORS preflight)", async () => {
    const t = convexTest();
    const response = await t.fetch("/randomFact", { method: "OPTIONS" });
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "GET"
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "POST"
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "PATCH"
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "DELETE"
    );
  });

  test("Non-existent route", async () => {
    const t = convexTest();
    const response = await t.fetch("/nonexistent", { method: "GET" });
    expect(response.status).toBe(404);
  });
});
