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
  RouteSpec,
  RouteSpecWithPath,
  RouteSpecWithPathPrefix,
} from "convex/server";
import { handleCors } from "./corsHelper";

type RouteSpecWithCors = RouteSpec & {
  noCors?: boolean;
  allowedOrigins?: string[];
};

// const defaultRouteSpecWithCors: RouteSpecWithCors = {
//   noCors: false,
//   allowedOrigins: [],
// };

/**
 * Factory function to create a new CorsHttpRouter instance.
 * @param allowedOrigins An array of allowed origins for CORS.
 * @returns A new CorsHttpRouter instance.
 */
export const corsHttpRouter = ({
  allowedOrigins,
}: {
  allowedOrigins: string[];
}) => new CorsHttpRouter({ allowedOrigins });

export class CorsHttpRouter extends HttpRouter {
  allowedOrigins: string[];

  /**
   * Constructor for CorsHttpRouter.
   * @param allowedOrigins An array of allowed origins for CORS.
   */
  constructor({ allowedOrigins }: { allowedOrigins: string[] }) {
    super();
    this.allowedOrigins = allowedOrigins;
  }

  /**
   * Overrides the route method to add CORS support.
   * @param routeSpec The route specification to be added.
   */
  corsRoute = (routeSpec: RouteSpecWithCors): void => {
    const tempRouter = httpRouter();
    tempRouter.exactRoutes = this.exactRoutes;
    tempRouter.prefixRoutes = this.prefixRoutes;

    const noCors = routeSpec.noCors ?? false;
    const allowedOrigins = routeSpec.allowedOrigins ?? this.allowedOrigins;

    if (noCors) {
      tempRouter.route(routeSpec);
      this.mergeRoutes(tempRouter);
      return;
    }
    const routeSpecWithCors = this.createRouteSpecWithCors(
      routeSpec,
      allowedOrigins
    );
    tempRouter.route(routeSpecWithCors);

    /**
     * Figure out what kind of route we're adding: exact or prefix and handle
     * accordingly.
     */
    if ("path" in routeSpec) {
      this.handleExactRoute(tempRouter, routeSpec, allowedOrigins);
    } else {
      this.handlePrefixRoute(tempRouter, routeSpec, allowedOrigins);
    }

    /**
     * Copy the routes from the temporary router to the main router.
     */
    this.mergeRoutes(tempRouter);
  };

  /**
   * Handles exact route matching and adds OPTIONS handler.
   * @param tempRouter Temporary router instance.
   * @param routeSpec Route specification for exact matching.
   */
  private handleExactRoute(
    tempRouter: HttpRouter,
    routeSpec: RouteSpecWithPath,
    allowedOrigins: string[]
  ): void {
    /**
     * exactRoutes is defined as a Map<string, Map<string, PublicHttpAction>>
     * where the KEY is the PATH and the VALUE is a map of methods and handlers
     */
    const currentMethodsForPath = tempRouter.exactRoutes.get(routeSpec.path);

    /**
     * createOptionsHandlerForMethods is a helper function that creates
     * an OPTIONS handler for all registered HTTP methods for the given path
     */
    const optionsHandler = this.createOptionsHandlerForMethods(
      Array.from(currentMethodsForPath?.keys() ?? []),
      allowedOrigins
    );

    /**
     * Add the OPTIONS handler for the given path
     */
    currentMethodsForPath?.set("OPTIONS", optionsHandler);

    /**
     * Add the updated methods for the given path to the exactRoutes map
     */
    tempRouter.exactRoutes.set(routeSpec.path, new Map(currentMethodsForPath));
  }

  /**
   * Handles prefix route matching and adds OPTIONS handler.
   * @param tempRouter Temporary router instance.
   * @param routeSpec Route specification for prefix matching.
   */
  private handlePrefixRoute(
    tempRouter: HttpRouter,
    routeSpec: RouteSpecWithPathPrefix,
    allowedOrigins: string[]
  ): void {
    /**
     * prefixRoutes is structured differently than exactRoutes. It's defined as
     * a Map<string, Map<string, PublicHttpAction>> where the KEY is the
     * METHOD and the VALUE is a map of paths and handlers.
     */
    const currentMethods = tempRouter.prefixRoutes.keys();
    const optionsHandler = this.createOptionsHandlerForMethods(
      Array.from(currentMethods ?? []),
      allowedOrigins
    );

    /**
     * Add the OPTIONS handler for the given path prefix
     */
    const optionsPrefixes =
      tempRouter.prefixRoutes.get("OPTIONS") ||
      new Map<string, PublicHttpAction>();
    optionsPrefixes.set(routeSpec.pathPrefix, optionsHandler);

    /**
     * Add the updated methods for the given path to the prefixRoutes map
     */
    tempRouter.prefixRoutes.set("OPTIONS", optionsPrefixes);
  }

  /**
   * Creates a new route specification with CORS support.
   * @param routeSpec Original route specification.
   * @returns Modified route specification with CORS handler.
   */
  private createRouteSpecWithCors(
    routeSpec: RouteSpec,
    allowedOrigins: string[]
  ): RouteSpec {
    const httpCorsHandler = handleCors({
      originalHandler: routeSpec.handler,
      allowedOrigins: allowedOrigins,
      allowedMethods: [routeSpec.method],
    });
    return {
      ...("path" in routeSpec
        ? { path: routeSpec.path }
        : { pathPrefix: routeSpec.pathPrefix }),
      method: routeSpec.method,
      handler: httpCorsHandler,
    };

    throw new Error("Invalid routeSpec");
  }

  /**
   * Creates an OPTIONS handler for the given HTTP methods.
   * @param methods Array of HTTP methods to be allowed.
   * @returns A CORS-enabled OPTIONS handler.
   */
  private createOptionsHandlerForMethods(
    methods: string[],
    allowedOrigins: string[]
  ): PublicHttpAction {
    return handleCors({
      allowedOrigins: allowedOrigins,
      allowedMethods: methods,
    });
  }

  /**
   * Finalizes the routes by copying them from the temporary router.
   * @param router Temporary router with updated routes.
   */
  private mergeRoutes(router: HttpRouter): void {
    this.exactRoutes = new Map(router.exactRoutes);
    this.prefixRoutes = new Map(router.prefixRoutes);
  }
}

export default corsHttpRouter;
