import { getItem } from "../../db/items.ts";
import { getLadder } from "../../db/ladders.ts";
import { assert, getAssertions, isNumber, r } from "../typeguards.ts";

export const vote = async (req: Request, params?: Record<string, string>) => {
  const ladderId = parseInt(params!.ladder);
  const ladder = getLadder(ladderId);
  if (!ladder) {
    return new Response(JSON.stringify({ error: "notfound" }), { status: 404 });
  }

  const body = await req.json() as unknown;
  try {
    assert(
      body,
      r({
        winner: isNumber,
        loser: isNumber,
      }),
    );
  } catch {
    console.error();
    return new Response(JSON.stringify(getAssertions()), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const winner = getItem(body.winner);
  if (!winner) {
    return new Response(JSON.stringify({ error: "notfound" }), { status: 404 });
  }

  const loser = getItem(body.loser);
  if (!loser) {
    return new Response(JSON.stringify({ error: "notfound" }), { status: 404 });
  }

  const expected = 1 / (1 + (10 ** ((winner.rating - loser.rating) / 400)));
  const change = 32 * expected;

  winner.rating += change;
  loser.rating -= change;

  ladder.votes++;

  return new Response(JSON.stringify([winner, loser]), {
    headers: { "Content-Type": "application/json" },
  });
};
