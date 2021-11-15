import { deleteItem, getItem } from "../../../db/items.ts";

export const getPair = (_req: Request, params?: Record<string, string>) => {
  const item = getItem(parseInt(params!.item));
  if (!item) {
    return new Response(JSON.stringify({ error: "notfound" }), { status: 404 });
  }

  deleteItem(item.id);

  return new Response("");
};
