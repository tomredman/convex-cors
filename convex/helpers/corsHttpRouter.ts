/**
 * This file defines a CorsHttpRouter class that extends Convex's HttpRouter.
 * It provides CORS (Cross-Origin Resource Sharing) support for HTTP routes.
 * 
 * The CorsHttpRouter:
 * 1. Allows specifying allowed origins for CORS.
 * 2. Overrides the route method to add CORS headers to all non-OPTIONS requests.
 * 3. Automatically adds an OPTIONS route to handle CORS preflight requests.
 * 4. Uses the handleCors helper function to apply CORS headers consistently.
 * 
 * This router simplifies the process of making Convex HTTP endpoints 
 * accessible to web applications hosted on different domains while 
 * maintaining proper CORS configuration.
 */

import {
  httpRouter,
  HttpRouter,
  PublicHttpAction,
  RoutableMethod,
  RouteSpecWithPath,
  RouteSpecWithPathPrefix,
  RouteSpec
} from "convex/server";
import { handleCors } from "./corsHelper";

export const corsHttpRouter = ({
  allowedOrigins,
}: {
  allowedOrigins: string[];
}) => new CorsHttpRouter({ allowedOrigins });

export class CorsHttpRouter extends HttpRouter {
  allowedOrigins: string[];

  constructor({ allowedOrigins }: { allowedOrigins: string[] }) {
    super();
    this.allowedOrigins = allowedOrigins;
  }

  route = (routeSpec: RouteSpec): void => {
    const router = httpRouter();
    router.route(routeSpec);

    console.log("HELLO OUT THERE!");
    console.log(this.exactRoutes);
    console.log("HELLOGOODBYE OUT THERE!");

    //this.addRoute(this, routeSpec.path, routeSpec.method, routeSpec.handler);
    const routes  = router.getRoutes();

    // if ('path' in routeSpec) {
    //   this.addOptionsRoute(this, routeSpec.path, routes);
    // }

    routes.forEach((path, method, endpoint) => {
      console.log("methods", methods);
      console.log("path", path);
      methods.forEach((handler, method) => {
        console.log("---");
        console.log(handler);
        console.log(method);
        console.log("+++");
        if (method === "OPTIONS") return; // OPTIONS is handled manually via addOptionsRoute()
        this.addRoute(router, path, method, handler);
      });
      //this.addOptionsRoute(router, path, methods);
    });

    this.updateRoutes(router);
  };

  private addRoute(
    router: HttpRouter,
    path: string ,
    method: RoutableMethod,
    handler: PublicHttpAction
  ): void {
    router.route({
      path,
      method,
      handler: handleCors({
        originalHandler: handler, 
        allowedOrigins: this.allowedOrigins,
        allowedMethods: [method],
      }),
    });
  }

  private addOptionsRoute(
    router: HttpRouter,
    path: string,
    methods: Map<RoutableMethod, PublicHttpAction>
  ): void {
    router.route({
      path,
      method: "OPTIONS",
      handler: handleCors({
        allowedOrigins: this.allowedOrigins,
        allowedMethods: Array.from(methods.keys()),
      }),
    });
  }

  private updateRoutes(router: HttpRouter): void {
    this.exactRoutes = new Map(router.exactRoutes);
    this.prefixRoutes = new Map(router.prefixRoutes);
    console.log(this.exactRoutes);
  }
}

export default corsHttpRouter;
