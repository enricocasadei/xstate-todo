import React, { useEffect, useState } from "react";

import { useMachine } from "@xstate/react";
import { todoMachine, queryClient } from "../../domain/todo";
import { useQuery, QueryClientProvider } from "react-query";
import { fetchTodos } from "./fetch";

export function Todos() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodosContent />
    </QueryClientProvider>
  );
}

function TodosContent() {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [machineState, sendToMachine] = useMachine(todoMachine, {
    devTools: true,
  });

  const { status, data } = useQuery("todos", fetchTodos);

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

  console.log("state of the machine", machineState.value);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "25px",
        margin: "50px",
      }}
    >
      <h1>XState & react-query ToDo App</h1>

      {machineState.matches("initialising") && <div>loading...</div>}
      {machineState.matches("dataLoadingError") && (
        <div>Couldn't load ToDos from server. Will retry automatically ...</div>
      )}
      <div>
        <p>Add ToDo:</p>
        <input onChange={onTodoTitleChange} type="text" />
        <button onClick={onTodoAddClick}>Add</button>
      </div>
      {machineState.matches("idle") && (
        <>
          {Object.keys(machineState.context.todos).map((todoKey) => (
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
          ))}
        </>
      )}
    </div>
  );
}
