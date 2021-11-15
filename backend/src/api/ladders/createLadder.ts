import { createLadder as dbCreateLadder, getId } from "../../db/ladders.ts";
import { assert, factor, getAssertions, isString, r } from "../typeguards.ts";

export const createLadder = async (req: Request) => {
  const body = await req.json() as unknown;
  try {
    assert(
      body,
      r({
        name: isString,
        type: factor("image" as const),
      }),
    );
  } catch {
    console.error();
    return new Response(JSON.stringify(getAssertions()), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ladder = dbCreateLadder({
    ...body,
    created: new Date(),
    id: getId(),
    votes: 0,
  });
  return new Response(JSON.stringify(ladder), {
    headers: { "Content-Type": "application/json" },
  });
};
