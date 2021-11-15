import { getId } from "../../../db/items.ts";
import { getLadder as dbGetLadder } from "../../../db/ladders.ts";
import { createItem as dbCreateItem } from "../../../db/items.ts";
import { assert, getAssertions, isString, r } from "../../typeguards.ts";

export const createItem = async (
  req: Request,
  params?: Record<string, string>,
) => {
  const ladderId = parseInt(params!.ladder);
  const ladder = dbGetLadder(ladderId);
  if (!ladder) {
    return new Response(JSON.stringify({ error: "notfound" }), {
      status: 404,
    });
  }

  const body = await req.json() as unknown;
  try {
    assert(
      body,
      r({ value: isString }),
    );
  } catch {
    console.error();
    return new Response(JSON.stringify(getAssertions()), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const item = dbCreateItem({
    ladder: ladderId,
    value: body.value,
    id: getId(),
    rating: 1000,
  });

  return new Response(JSON.stringify(item));
};
