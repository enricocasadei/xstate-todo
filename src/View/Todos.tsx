import React, { useEffect, useState } from "react";

import { useMachine } from "@xstate/react";
import { useQuery } from "react-query";
import { todoMachine, queryCache } from "../domain/todo";

/**
 * Mock ToDo API: To make sure local changes are not overwritten
 * the mock API gets the data from the query cache (which would
 * in reality never happen)
 */
const fetchTodos = () => {
  return new Promise((resolve, reject) => {
    const shouldFail = Math.random() > 0.9;
    setTimeout(() => {
      if (shouldFail) {
        reject();
      } else {
        const todos = queryCache.getQueryData("todos");
        if (typeof todos !== "undefined") {
          resolve(todos);
        } else {
          resolve({
            "bec287d4-1b48-47d7-ba16-ff24f40608d0": {
              id: "bec287d4-1b48-47d7-ba16-ff24f40608d0",
              title: "learn state machines",
              done: false,
            },
            "92f3f28b-3775-4ce5-aa9b-2926f8deff2e": {
              id: "92f3f28b-3775-4ce5-aa9b-2926f8deff2e",
              title: "learn react query",
              done: false,
            },
            "1320fdb8-02bb-44b5-945c-865359216dbc": {
              id: "1320fdb8-02bb-44b5-945c-865359216dbc",
              title: "combine react query and state  machines",
              done: false,
            },
          });
        }
      }
    }, 1500);
  });
};

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
const ToDo = ({ todoKey, todoMachineService }) => {
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
};

export default function App() {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [machineState, sendToMachine, todoMachineService] = useMachine(
    todoMachine,
    { devTools: true }
  );

  // set up react-query with `todos` query key
  const { status, data } = useQuery("todos", fetchTodos);

  /** respond to changes of the query data
   * NOTE: the onSuccess callback of react-query could also be used for this
   * but it will only be run when the data update is the result of a fetch,
   * not when the local queryCache has been updated by other means
   */
  useEffect(() => {
    if (status === "success") {
      sendToMachine("DATA_UPDATE", { data });
    } else if (status === "error") {
      sendToMachine("DATA_LOAD_ERROR");
    }
  }, [data, status]);

  const onTodoTitleChange = (evt: any) => {
    setNewTodoTitle(evt.currentTarget.value);
  };

  const onTodoAddClick = () => {
    sendToMachine({ type: "ADD_TODO", newTodoTitle });
  };

  return (
    <div className="App">
      <h1>XState & react-query ToDo App</h1>

      {machineState.matches("initialising") && <div>loading...</div>}
      {machineState.matches("dataLoadingError") && (
        <div>Couldn't load ToDos from server. Will retry automatically ...</div>
      )}
      {machineState.matches("idle") && (
        <>
          {Object.keys(machineState.context.todos).map((todoKey) => (
            <ToDo
              key={todoKey}
              todoKey={todoKey}
              todoMachineService={todoMachineService}
            />
          ))}
        </>
      )}
      <div>
        <p>Add ToDo:</p>
        <input onChange={onTodoTitleChange} type="text" />
        <button onClick={onTodoAddClick}>Add</button>
      </div>
    </div>
  );
}
