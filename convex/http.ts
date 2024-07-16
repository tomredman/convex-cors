import { getFact } from "./myHttpApi";
import { corsHttpRouter } from "./helpers/corsHttpRouter";

const http = corsHttpRouter({
  allowedOrigins: ["*"],
});

/**
 * Exact routes will match /fact exactly
 */
http.route({
  path: "/fact",
  method: "GET",
  handler: getFact,
});

http.route({
  path: "/fact",
  method: "POST",
  handler: getFact,
});

http.route({
  path: "/fact",
  method: "PATCH",
  handler: getFact,
});

http.route({
  path: "/fact",
  method: "DELETE",
  handler: getFact,
});

/**
 * Prefix routes will match /dynamicFact/123 and /dynamicFact/456 etc.
 */
http.route({
  pathPrefix: "/dynamicFact/",
  method: "GET",
  handler: getFact,
});

http.route({
  pathPrefix: "/dynamicFact/",
  method: "PATCH",
  handler: getFact,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
