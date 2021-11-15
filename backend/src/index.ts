import { serve } from "std/http/server.ts";
import { createItem } from "./api/ladders/items/createItem.ts";
import { createLadder } from "./api/ladders/createLadder.ts";
import { getLadder } from "./api/ladders/getLadder.ts";
import { listLadders } from "./api/ladders/list.ts";
import { cors } from "./middleware/cors.ts";
import { Router } from "./Router.ts";
import { getPair } from "./api/ladders/items/getPair.ts";
import { vote } from "./api/ladders/vote.ts";
import { getTop } from "./api/ladders/getTop.ts";

console.log(new Date(), "Server started, listening to :8000");

const router = new Router();

router.get("/ladders", listLadders);
router.get("/ladders/:ladder", getLadder);
router.get("/ladders/:ladder/pair", getPair);
router.get("/ladders/:ladder/top", getTop);
router.post("/ladders", createLadder);
router.post("/ladders/:ladder/items", createItem);
router.post("/ladders/:ladder/items/:item/error", vote);
router.post("/ladders/:ladder/vote", vote);

router.use(cors);

serve(async (req, connInfo) => {
  const start = Date.now();
  const res = await router.route(req);
  console.log(
    new Date(),
    "path" in connInfo.remoteAddr
      ? connInfo.remoteAddr.path
      : connInfo.remoteAddr.hostname,
    "-",
    req.method,
    req.url,
    "->",
    res.status,
    Date.now() - start + "ms",
  );
  return res;
});
