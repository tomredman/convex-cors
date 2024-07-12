/**
 * handleCors() is a higher-order function that wraps a Convex HTTP action handler to add CORS support.
 * It allows for customization of allowed HTTP methods and origins for cross-origin requests.
 * 
 * The function:
 * 1. Validates and normalizes the allowed HTTP methods.
 * 2. Generates appropriate CORS headers based on the provided configuration.
 * 3. Handles preflight OPTIONS requests automatically.
 * 4. Wraps the original handler to add CORS headers to its response.
 * 
 * This helper simplifies the process of making Convex HTTP actions accessible 
 * to web applications hosted on different domains.
 */

import { PublicHttpAction, ROUTABLE_HTTP_METHODS, RoutableMethod } from "convex/server";
import { httpAction } from "../_generated/server";

const SECONDS_IN_A_DAY = 60 * 60 * 24;

/**
 * Example CORS origins:
 * - "*" (allow all origins)
 * - "https://example.com" (allow a specific domain)
 * - "https://*.example.com" (allow all subdomains of example.com)
 * - "https://example1.com, https://example2.com" (allow multiple specific domains)
 * - "null" (allow requests from data URLs or local files)
 */

const defaultCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": SECONDS_IN_A_DAY.toString(),
};

const handleCors = ({
  originalHandler,
  allowedMethods = ["OPTIONS"],
  allowedOrigins = ["*"],
}: {
  originalHandler?: PublicHttpAction;
  allowedMethods?: string[];
  allowedOrigins?: string[];
}) => {
  const uniqueMethods = Array.from(
    new Set(
      allowedMethods.map((method) => method.toUpperCase() as RoutableMethod)
    )
  );
  const filteredMethods = uniqueMethods.filter((method) =>
    ROUTABLE_HTTP_METHODS.includes(method)
  );

  if (filteredMethods.length === 0) {
    throw new Error("No valid HTTP methods provided");
  }

  /**
   * Ensure OPTIONS is not duplicated if it was passed in
   * E.g. if allowedMethods = ["GET", "OPTIONS"]
   */
  const allowMethods = filteredMethods.includes("OPTIONS")
    ? filteredMethods.join(", ")
    : [...filteredMethods, "OPTIONS"].join(", ");

  /**
   * Format origins correctly
   * E.g. "https://example1.com, https://example2.com"
   */
  const allowOrigins = allowedOrigins.join(", ");

  /**
   * Build up the set of CORS headers
   * including any dynamic ones
   */
  const corsHeaders = {
    ...defaultCorsHeaders,
    "Access-Control-Allow-Methods": allowMethods,
    "Access-Control-Allow-Origin": allowOrigins,
  };

  /**
   * Return our modified HTTP action
   */
  return httpAction(async (_, request) => {
    /**
     * OPTIONS has no handler and just returns headers
     */
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: new Headers(corsHeaders),
      });
    }

    /**
     * If the method is not OPTIONS, it must pass a handler
     */
    if (!originalHandler) {
      throw new Error("No PublicHttpAction provider to CORS handler");
    }

    /**
     * First, we fire the original handler
     */
    const originalResponse = await originalHandler(_, request);

    /**
     * Second, get a copy of its headers
     */
    const newHeaders = new Headers(originalResponse.headers);

    /**
     * Third, add or upadte our CORS headers
     */
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    /**
     * Fouth, return the modified Response.
     * Note that a Response object is immutable,
     * which is why we create a new one to return here.
     */
    return new Response(originalResponse.body, {
      status: originalResponse.status,
      statusText: originalResponse.statusText,
      headers: newHeaders,
    });
  });
};

export { handleCors };
