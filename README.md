# Welcome to the Convex CORS-Enabled HTTP Router Project!

## Overview

This project demonstrates how to enhance your Convex HTTP endpoints with CORS (Cross-Origin Resource Sharing) support using a custom `corsHttpRouter`. This router is a drop-in replacement for Convex's standard `httpRouter`, making it easy to add CORS headers to your HTTP routes.

## Features

- **CORS Support**: Automatically adds CORS headers to your HTTP responses.
- **Preflight Requests**: Handles OPTIONS requests for CORS preflight checks.
- **Flexible Configuration**: Specify allowed origins and methods for your routes.

## How It Works

The `corsHttpRouter` extends Convex's `httpRouter` to include CORS functionality. It overrides the `route` method to add CORS headers to all non-OPTIONS requests and automatically adds an OPTIONS route to handle CORS preflight requests.

Here's a snippet from our `http.ts` file demonstrating how to use the `corsHttpRouter`:

```typescript
import { getFact } from "./myHttpApi";
import { corsHttpRouter } from "./helpers/corsHttpRouter";

// Your standard Convex http router:
// const router = httpRouter();

// Your CORS router:
const router = corsHttpRouter({
  allowedOrigins: ["http://localhost:3000"], // or '*' to allow all
});

/**
 * CORS routes
 */
http.corsRoute({
  path: "/fact",
  method: "GET",
  handler: getFact,
});

http.corsRoute({
  path: "/fact",
  method: "POST",
  handler: getFact,
});

/**
 * Non-CORS routes
 */
http.route({
  path: "/nocors/fact",
  method: "GET",
  handler: getFact,
});

http.route({
  path: "/nocors/fact",
  method: "POST",
  handler: getFact,
});
```

You can provide optional allowedOrigins per route:

```typescript
/**
 * Per-path "allowedOrigins" will override the default "allowedOrigins" for that route
 */
http.corsRoute({
  path: "/specialRouteOnlyForThisOrigin",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ message: "Custom allowed origins! Wow!" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }),
  allowedOrigins: ["http://localhost:3000"],
});
```

## Getting Started

### Installation

To get started with this project, clone the repository and install the dependencies:

```bash
npm install
```

### Running the Project

To run the project in development mode, use the following command:

```bash
npm run dev
```

### Running Tests

To run the tests, use the following command:

```bash
npm run test
```

## Example Routes

### Exact Routes

These routes match the exact path specified:

- **GET /fact**: Fetch a random fact.
- **POST /fact**: Add a new fact.
- **PATCH /fact**: Update an existing fact.
- **DELETE /fact**: Delete a fact.

### Prefix Routes

These routes match any path that starts with the specified prefix:

- **GET /dynamicFact/**: Fetch a dynamic fact.
- **PATCH /dynamicFact/**: Update a dynamic fact.

## Conclusion

This project simplifies the process of adding CORS support to your Convex HTTP endpoints. With `corsHttpRouter`, you can ensure your endpoints are accessible to web applications hosted on different domains while maintaining proper CORS configuration.

Happy coding!
