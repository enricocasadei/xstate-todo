import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

type Temperature = { C?: number; F?: number };

export const temperatureMachine = createMachine<Temperature>({
  initial: "active",
  context: {},
  states: {
    active: {
      on: {
        CELSIUS: {
          actions: assign({
            C: (_, event) => parseFloat(event.value).toFixed(2),
            F: (_, event) =>
              event.value.length ? +event.value * (9 / 5) + 32 : undefined,
          }),
        },
        FAHRENHEIT: {
          actions: assign({
            C: (_, event) =>
              event.value.length ? (+event.value - 32) * (5 / 9) : undefined,
            F: (_, event) => parseFloat(event.value).toFixed(2),
          }),
        },
      },
    },
  },
});

export const useTemperature = () => useMachine(temperatureMachine);
