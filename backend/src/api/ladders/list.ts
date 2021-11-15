import { listLadders as dbListLadders } from "../../db/ladders.ts";

export const listLadders = () => {
  return new Response(JSON.stringify(dbListLadders()), {
    headers: { "Content-Type": "application/json" },
  });
};
