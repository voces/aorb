import { Fragment, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { Ladder } from "../../../backend/src/db/ladders.ts";
import { config } from "../config.ts";
import { route } from "preact-router";

export const CreateLadder = ({}: { path: string }) => {
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  return (
    <>
      <form
        onSubmit={(e) => {
          if (pending) return;
          setPending(true);
          e.preventDefault();
          e.stopPropagation();
          fetch(config.api + "/ladders", {
            method: "POST",
            body: JSON.stringify({ name, type: "image" }),
          }).then((r) => r.json()).then((ladder: Ladder) => {
            setPending(false);
            route(`/${ladder.id}`);
          });
        }}
      >
        <p>
          <input
            placeholder="Name"
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
            ref={input}
          />
        </p>
        <p>
          <button type="submit" disabled={pending || name.trim().length === 0}>
            Create!
          </button>
        </p>
      </form>
      <a href="/">Cancel</a>
    </>
  );
};
