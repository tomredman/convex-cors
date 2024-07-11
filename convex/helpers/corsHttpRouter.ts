import {
  httpRouter,
  HttpRouter,
  PublicHttpAction,
  RoutableMethod,
  RouteSpec,
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

    this.exactRoutes.forEach((methods, path) => {
      methods.forEach((handler, method) => {
        if (method === "OPTIONS") {
          return;
        }
        this.addRoute(router, path, method, handler);
      });
      this.addOptionsRoute(router, path, methods);
    });

    this.updateRoutes(router);
  };

  private addRoute(
    router: HttpRouter,
    path: string,
    method: RoutableMethod,
    handler: PublicHttpAction
  ): void {
    router.route({
      path,
      method,
      handler,
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
