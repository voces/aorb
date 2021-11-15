import { Fragment, h } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { Ladder as LadderType } from "../../../backend/src/db/ladders.ts";
import { config } from "../config.ts";
import { route } from "preact-router";
import { Item } from "../../../backend/src/db/items.ts";

export const Add = (
  { empty, ladder, refresh }: {
    empty: boolean;
    ladder: number;
    refresh: () => void;
  },
) => {
  const [pending, setPending] = useState(false);
  const [url, setUrl] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (empty) {
      input.current?.focus();
    }
  }, [empty]);

  return (
    <form
      style={{ paddingTop: 128 }}
      onSubmit={(e) => {
        if (pending) return;
        setPending(true);
        e.preventDefault();
        e.stopPropagation();

        fetch(`${config.api}/ladders/${ladder}/items`, {
          method: "POST",
          body: JSON.stringify({ value: url }),
        }).then((r) => {
          if (r.ok) setUrl("");
          setPending(false);
          if (empty) refresh();
        });
      }}
    >
      <input
        placeholder="https://example.com/image.jpg"
        value={url}
        onInput={(e) => setUrl(e.currentTarget.value)}
        type="url"
        ref={input}
      />
      <button disabled={pending || url.trim().length === 0}>Add</button>
    </form>
  );
};

const Pair = (
  { left, right, ladder, next }: {
    left: Item;
    right: Item;
    ladder: number;
    next: () => void;
  },
) => {
  const [pending, setPending] = useState(false);

  const vote = useCallback((winner: Item, loser: Item) => {
    if (pending) return;
    setPending(true);

    fetch(`${config.api}/ladders/${ladder}/vote`, {
      method: "POST",
      body: JSON.stringify({ winner: winner.id, loser: loser.id }),
    }).then((r) => {
      setPending(false);
      if (r.ok) {
        next();
      }
    });
  }, []);

  const loadError = async (item: Item) => {
    setPending(true);

    await fetch(`${config.api}/ladders/${ladder}/items/${item.id}/error`, {
      method: "POST",
    });

    setPending(false);
  };

  return (
    <div
      style={{ paddingTop: 32, display: "flex", justifyContent: "center" }}
    >
      <img
        style={{
          objectFit: "contain",
          maxWidth: "calc(50vw - 8px)",
          maxHeight: "500px",
          paddingRight: 8,
          cursor: "pointer",
        }}
        src={left.value}
        onClick={() => vote(left, right)}
        onError={(e) => loadError(left).then(next)}
      />
      <img
        style={{
          objectFit: "contain",
          maxWidth: "calc(50vw - 8px)",
          maxHeight: "500px",
          paddingLeft: 8,
          cursor: "pointer",
        }}
        src={right.value}
        onClick={() => vote(right, left)}
        onError={(e) => loadError(right).then(next)}
      />
    </div>
  );
};

export const Ladder = (
  { ladder: ladderId }: { path: string; ladder: string },
) => {
  const [ladder, setLadder] = useState<LadderType>();
  const [pair, setPair] = useState<Item[]>();
  const [top, setTop] = useState<Item[]>();

  const fetchPair = useCallback(() => {
    fetch(`${config.api}/ladders/${ladderId}/pair`).then((r) => {
      if (!r.ok) return route("/");
      return r.json();
    }).then(setPair);
  }, []);

  useEffect(() => {
    fetch(`${config.api}/ladders/${ladderId}`).then((r) => {
      if (!r.ok) return route("/");
      return r.json();
    }).then(setLadder);

    fetchPair();

    fetch(`${config.api}/ladders/${ladderId}/top`).then((r) => {
      if (!r.ok) return route("/");
      return r.json();
    }).then(setTop);
  }, []);

  if (!ladder || !pair) return null;

  return (
    <>
      <h2>{ladder.name}</h2>
      {pair?.length === 2 && (
        <Pair
          left={pair[0]}
          right={pair[1]}
          ladder={ladder.id}
          next={() => {
            setPair(undefined);
            fetchPair();
            setPair(undefined);
          }}
        />
      )}
      <Add
        ladder={ladder.id}
        empty={pair?.length !== 2}
        refresh={() => {
          fetchPair();
        }}
      />
      {top && (
        <div style={{ display: "flex" }}>
          {top.map((item) => (
            <img
              style={{ objectFit: "cover", maxWidth: 200, maxHeight: 200 }}
              src={item.value}
              title={Math.round(item.rating).toString()}
            />
          ))}
        </div>
      )}
    </>
  );
};
