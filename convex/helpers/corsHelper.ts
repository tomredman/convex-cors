import { ROUTABLE_HTTP_METHODS, RoutableMethod } from "convex/server";
import { httpAction } from "../_generated/server";

const SECONDS_IN_A_DAY = 60 * 60 * 24;

const defaultCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": SECONDS_IN_A_DAY.toString(),
};

const handleCors = ({
  allowedMethods = ["OPTIONS"],
  allowedOrigins = ["*"],
}: {
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

  // Ensure OPTIONS is not duplicated
  const allowMethods = filteredMethods.includes("OPTIONS")
    ? filteredMethods.join(", ")
    : [...filteredMethods, "OPTIONS"].join(", ");

  const allowOrigins = allowedOrigins.join(", ");

  const corsHeaders = {
    ...defaultCorsHeaders,
    "Access-Control-Allow-Methods": allowMethods,
    "Access-Control-Allow-Origin": allowOrigins,
  };

  console.log(corsHeaders);

  return httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: new Headers(corsHeaders),
    });
  });
};

export { handleCors };
