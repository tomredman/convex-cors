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
import { corsHttpRouter } from "./corsHttpRouter";

const router = corsHttpRouter({
  allowedOrigins: ["http://localhost:3000"],
  allowedMethods: ["GET", "POST", "PUT", "DELETE"],
});

router.route("/hello", async (req, res) => {
  res.send("Hello World!");
});

router.listen(3001, () => {
  console.log("Server started on port 3001");
});
```

## Getting Started

To run the project, simply execute the following commands:

```bash
npm i
npm run dev
```

To run the tests, use the following command:

```bash
npm run tests
```

Enjoy exploring the project and learning more about how to add CORS support to your Convex applications!
