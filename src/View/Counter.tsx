import React from "react";
import { useCounter } from "../domain/counter";

export function Counter() {
  const [current, send] = useCounter();
  const { count } = current.context;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "25px",
        margin: "50px",
      }}
    >
      <h1>Counter app</h1>
      <div>
        <button onClick={() => send("INCREMENT")}>Increment</button>{" "}
        <button onClick={() => send("DECREMENT")}>Decrement</button>{" "}
      </div>
      <div>
        <code>
          <strong>{count}</strong> times
        </code>
      </div>
    </div>
  );
}
