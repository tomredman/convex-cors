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
  RouteSpec,
  ROUTABLE_HTTP_METHODS
} from "convex/server";
import { handleCors } from "./corsHelper";
import { error } from "console";

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
    const tempRouter = httpRouter();
    tempRouter.exactRoutes = this.exactRoutes;
    tempRouter.prefixRoutes = this.prefixRoutes;
    const routeSpecWithCors = this.createRouteSpecWithCors(routeSpec);
    tempRouter.route(routeSpecWithCors);

    if ('path' in routeSpec) {
      const currentMethodsForPath = tempRouter.exactRoutes.get(routeSpec.path);
      const optionsHandler = this.createOptionsHandlerForMethods(Array.from(currentMethodsForPath?.keys() ?? [])
      );
      currentMethodsForPath?.set("OPTIONS", optionsHandler);
      tempRouter.exactRoutes.set(routeSpec.path, new Map(currentMethodsForPath));
    }
    else if ('pathPrefix' in routeSpec) {
      const currentHandlerForMethod = tempRouter.prefixRoutes.get("OPTIONS");
      const optionsHandler = this.createOptionsHandlerForMethods(Array.from(currentHandlerForMethod?.keys() ?? []));
      currentHandlerForMethod?.set(routeSpec.pathPrefix, optionsHandler);
      tempRouter.prefixRoutes.set("OPTIONS", new Map(currentHandlerForMethod));
    }

    this.bakeRoutes(tempRouter);
  };

  private createRouteSpecWithCors(routeSpec: RouteSpec): RouteSpec {
    const httpCorsHandler = handleCors({ originalHandler: routeSpec.handler, allowedOrigins: this.allowedOrigins, allowedMethods: [routeSpec.method] });
    const httpCorsMethod = routeSpec.method;
    if ('path' in routeSpec) {
      return {
        path: routeSpec.path,
        method: httpCorsMethod,
        handler: httpCorsHandler,
      };
    }
    else if ('pathPrefix' in routeSpec) {
      return {
        pathPrefix: routeSpec.pathPrefix,
        method: httpCorsMethod,
        handler: httpCorsHandler
      };
    }

    throw new Error("Invalid routeSpec");
  }

  private createOptionsHandlerForMethods(
    methods: string[]
  ): PublicHttpAction {
    return handleCors({
      allowedOrigins: this.allowedOrigins,
      allowedMethods: methods,
    });
  }

  private bakeRoutes(router: HttpRouter): void {
    this.exactRoutes = new Map(router.exactRoutes);
    this.prefixRoutes = new Map(router.prefixRoutes);
  }
}

export default corsHttpRouter;