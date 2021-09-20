import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

export enum PaymentStatus {
  Idle = "idle",
  AuthorizationRequired = "authorization_required",
  Authorizing = "authorizing",
  Authorized = "authorized",
  AuthorizationFailed = "authorization_failed",
  Successful = "successful",
  Failed = "failed",
}

type Context = {
  stack: PaymentStatus[];
};

const paymentMachine = createMachine<Context>({
  id: "statuses",
  initial: "idle",
  context: {
    // history stack
    stack: [],
  },
  states: {
    idle: {
      on: {
        SUBMIT: PaymentStatus.AuthorizationRequired,
      },
    },
    [PaymentStatus.AuthorizationRequired]: {
      invoke: {
        id: "getStatus(PaymentStatus.AuthorizationRequired)",
        src: () => getStatus(PaymentStatus.AuthorizationRequired),
        onDone: {
          target: PaymentStatus.Authorizing,
          actions: assign({
            stack: (context, event) => context.stack.concat(event.data.step),
          }),
        },
        onError: {
          target: PaymentStatus.Failed,
        },
      },
    },
    [PaymentStatus.Authorizing]: {
      invoke: {
        id: "getStatus(PaymentStatus.Authorizing)",
        src: () => getStatus(PaymentStatus.Authorizing),
        onDone: {
          target: PaymentStatus.Authorized,
          actions: assign({
            stack: (context, event) => context.stack.concat(event.data.step),
          }),
        },
        onError: {
          target: PaymentStatus.AuthorizationFailed,
        },
      },
    },
    [PaymentStatus.Authorized]: {
      invoke: {
        id: "getStatus(PaymentStatus.Authorized)",
        src: () => getStatus(PaymentStatus.Authorized),
        onDone: {
          target: PaymentStatus.Successful,
          actions: assign({
            stack: (context, event) => context.stack.concat(event.data.step),
          }),
        },
        onError: {
          target: PaymentStatus.Failed,
        },
      },
    },
    [PaymentStatus.Successful]: {
      entry: assign({
        stack: (context) => context.stack.concat(PaymentStatus.Successful),
      }),
      on: {
        SUBMIT: PaymentStatus.AuthorizationRequired,
      },
    },
    [PaymentStatus.AuthorizationFailed]: {
      entry: assign({
        stack: (context) =>
          context.stack.concat(PaymentStatus.AuthorizationFailed),
      }),
      on: {
        SUBMIT: PaymentStatus.AuthorizationRequired,
      },
    },
    [PaymentStatus.Failed]: {
      entry: assign({
        stack: (context) => context.stack.concat(PaymentStatus.Failed),
      }),
      on: {
        SUBMIT: PaymentStatus.AuthorizationRequired,
      },
    },
  },
});
export const usePayment = () => useMachine(paymentMachine);

function getStatus(context: string): Promise<{ step: string }> {
  if (Math.floor(Math.random() * 10) > 8) {
    return Promise.reject("ERROR");
  }

  return Promise.resolve({ step: context });
}
