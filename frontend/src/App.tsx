import { h } from "preact";
import Router from "preact-router";
import { Ladders } from "./components/Ladders.tsx";
import { CreateLadder } from "./components/CreateLadder.tsx";
import { Ladder } from "./components/Ladder.tsx";

export const App = () => (
  <div style={{ textAlign: "center" }}>
    <h1>A or B</h1>
    <Router>
      <CreateLadder path="/create" />
      <Ladder path="/:ladder" ladder="" />
      <Ladders default />
    </Router>
  </div>
);
