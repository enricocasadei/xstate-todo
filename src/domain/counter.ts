import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

type Counter = { count: number };

export const counterMachine = createMachine<Counter>({
  initial: "active",
  context: { count: 0 },
  states: {
    active: {
      on: {
        INCREMENT: {
          actions: assign({ count: (ctx) => ctx.count + 1 }),
        },
        DECREMENT: {
          actions: assign({ count: (ctx) => ctx.count - 1 }),
        },
      },
    },
  },
});

export const useCounter = () => useMachine(counterMachine);
