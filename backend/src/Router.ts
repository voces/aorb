type Method = "POST" | "GET";

type Handler = (
  req: Request,
  params?: Record<string, string>,
  previousResponse?: Response,
) => undefined | Response | Promise<Response>;

export class Router {
  #routes: Record<Method, { pattern: URLPattern; handler: Handler }[]> = {
    GET: [],
    POST: [],
  };

  use(handler: Handler): void;
  use(pathname: string, handler: Handler): void;
  use(arg1: Handler | string, arg2?: Handler) {
    const handler = typeof arg1 === "function" ? arg1 : arg2!;
    const pathname = typeof arg1 === "string" ? arg1 : undefined;

    const pattern = new URLPattern({ pathname });

    this.#routes.GET.push({ pattern, handler });
    this.#routes.POST.push({ pattern, handler });
  }

  get(pathname: string, handler: Handler) {
    this.#routes.GET.push({ pattern: new URLPattern({ pathname }), handler });
  }

  post(pathname: string, handler: Handler) {
    this.#routes.POST.push({ pattern: new URLPattern({ pathname }), handler });
  }

  async route(request: Request): Promise<Response> {
    try {
      let resp: Response | undefined;

      const method = request.method.toUpperCase();
      if (!(method in this.#routes)) {
        return new Response(`Unsupported method: ${method}`, { status: 404 });
      }

      for (const { pattern, handler } of this.#routes[method as Method]) {
        const res = pattern.exec(request.url);
        if (!res) continue;

        resp = await handler(request, res.pathname.groups, resp);
      }

      if (resp) return resp;

      return new Response(`Unhandled path: ${request.url}`, { status: 404 });
    } catch (err) {
      console.error(err);
      return new Response(`Unhandled exception: ${err.message}`, {
        status: 500,
      });
    }
  }
}
