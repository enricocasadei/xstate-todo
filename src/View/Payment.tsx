import React, { useEffect } from "react";
import { usePayment } from "../domain/payment";

export function Payment() {
  const [current, send, service] = usePayment();

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      // simple state logging
      console.log(state.value);
    });

    return subscription.unsubscribe;
  }, [service]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "25px",
        margin: "50px",
      }}
    >
      <h1>Payment app</h1>
      <button onClick={() => send("SUBMIT")}>Start payment</button>
      <div>
        <p>Current state</p>
        <code>{JSON.stringify(current.value)}</code>
      </div>

      <div>
        <p>Current stack</p>
        <code>
          <ul>
            {current.context.stack.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ul>
        </code>
      </div>
    </div>
  );
}
