import { getRandomFact } from "./myHttpApi";
import corsHttpRouter from "./helpers/corsHttpRouter";

const http = corsHttpRouter({
  allowedOrigins: ["*"],
});

http.route({
  path: "/randomFact",
  method: "GET",
  handler: getRandomFact,
});

// http.route({
//   path: "/randomFact",
//   method: "POST",
//   handler: getRandomFact,
// });

// http.route({
//   path: "/randomFact",
//   method: "PATCH",
//   handler: getRandomFact,
// });

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
