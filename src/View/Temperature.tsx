import React from "react";
import { useTemperature } from "../domain/temperature";

export function Temperature() {
  const [current, send] = useTemperature();
  const { C, F } = current.context;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "25px",
        margin: "50px",
      }}
    >
      <h1>Temperature app</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "400px",
        }}
      >
        CELSIUS
        <input
          type="number"
          value={C}
          onChange={(e) => send("CELSIUS", { value: e.target.value })}
        />{" "}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "400px",
        }}
      >
        FAHRENHEIT
        <input
          type="number"
          value={F}
          onChange={(e) => send("FAHRENHEIT", { value: e.target.value })}
        />{" "}
      </div>
    </div>
  );
}
