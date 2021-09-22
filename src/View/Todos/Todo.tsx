import React from "react";
import { useMachine } from "@xstate/react";
import { TodoMachineType } from "../../domain/todo";

/**
 * Component for an individual ToDo Item that can send events straight to the
 * ToDo machine to update the status or delete the ToDo item.
 *
 * It is important to use the `useService` hook here instead of useMachine
 * as a new machine instance would be spun up instead.
 *
 * The todo props such as title and done state are directly taken from the machine
 * context instead of being passed in individually.
 */
export function Todo({
  todoKey,
  todoMachineService,
}: {
  todoKey: string;
  todoMachineService: TodoMachineType;
}) {
  const [machineState, sendToMachine] = useMachine(todoMachineService);
  return (
    <div key={todoKey}>
      <button
        onClick={() => {
          sendToMachine({
            type: "TOGGLE_TODO_DONE",
            todoItem: machineState.context.todos[todoKey],
          });
        }}
      >
        {machineState.context.todos[todoKey].done ? "Reopen " : "Done "}
        <span role="img" aria-label="done">
          {machineState.context.todos[todoKey].done ? "↩" : "✅"}
        </span>
      </button>
      <button
        onClick={() => {
          sendToMachine({
            type: "TODO_DELETED",
            todoItem: machineState.context.todos[todoKey],
          });
        }}
      >
        Delete
        <span role="img" aria-label="delete">
          ❌
        </span>
      </button>
      <span
        className={
          machineState.context.todos[todoKey].done
            ? "todoDone"
            : "todoOutstanding"
        }
      >
        {machineState.context.todos[todoKey].title}
      </span>
    </div>
  );
}
