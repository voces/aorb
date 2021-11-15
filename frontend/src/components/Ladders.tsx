import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Ladder } from "../../../backend/src/db/ladders.ts";
import { config } from "../config.ts";

export const Ladders = ({}: { default: boolean }) => {
  const [ladders, setLadders] = useState<Ladder[]>([]);
  useEffect(() => {
    fetch(config.api + "/ladders").then((r) => r.json()).then((ret) =>
      setLadders(ret)
    );
  }, []);

  return (
    <>
      {ladders.map((ladder) => (
        <a style={{ display: "block" }} href={`/${ladder.id}`}>{ladder.name}</a>
      ))}
      <a style={{ display: "block", paddingTop: 8 }} href="/create">
        Create new ladder
      </a>
    </>
  );
};
