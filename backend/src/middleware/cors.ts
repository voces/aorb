import { config } from "../config.ts";

export const cors = (req: Request, _: unknown, resp?: Response) => {
  if (!resp) resp = new Response("", { status: 404 });

  resp.headers.append("access-control-request-method", "POST,GET");
  resp.headers.append("access-control-allow-headers", "content-type");

  const originHeader = req.headers.get("origin");
  if (
    originHeader &&
    config.cors.includes(originHeader)
  ) {
    resp.headers.append(
      "access-control-allow-origin",
      originHeader,
    );
  }

  return resp;
};
