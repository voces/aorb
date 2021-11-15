import { getRandomItem } from "../../../db/items.ts";

export const getPair = (_req: Request, params?: Record<string, string>) => {
  const ladder = parseInt(params?.ladder!);
  const itemA = getRandomItem(ladder);
  if (!itemA) return new Response("[]");
  let itemB = getRandomItem(ladder);
  let tries = 10;
  while (itemA.id === itemB.id && tries--) itemB = getRandomItem(ladder);

  return new Response(
    itemA.id === itemB.id ? "[]" : JSON.stringify([itemA, itemB]),
  );
};
