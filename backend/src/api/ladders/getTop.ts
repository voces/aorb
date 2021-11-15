import { getTop as dbGetTop } from "../../db/items.ts";

export const getTop = (_req: Request, params?: Record<string, string>) => {
  const ladder = parseInt(params?.ladder!);

  return new Response(
    JSON.stringify(dbGetTop(ladder, 0, 10)),
  );
};
