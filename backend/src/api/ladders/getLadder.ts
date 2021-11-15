import { getLadder as dbGetLadder } from "../../db/ladders.ts";

export const getLadder = (
  _req: Request,
  params?: Record<string, string>,
) => {
  const ladder = dbGetLadder(parseInt(params!.ladder));
  return new Response(JSON.stringify(ladder ?? { error: "notfound" }), {
    status: ladder ? 200 : 404,
  });
};
