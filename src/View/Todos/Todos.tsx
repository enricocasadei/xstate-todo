import React, { useEffect, useState } from "react";

import { useMachine } from "@xstate/react";

import { todoMachine, queryClient, TodoMachineType } from "../../domain/todo";
import { useQuery, QueryClientProvider } from "react-query";
import { Todo } from "./Todo";
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
  const [machineState, sendToMachine, todoMachineService] = useMachine(
    todoMachine,
    { devTools: true }
  );

  // set up react-query with `todos` query key
  const { status, data } = useQuery("todos", fetchTodos);

  /** respond to changes of the query data
   * NOTE: the onSuccess callback of react-query could also be used for this
   * but it will only be run when the data update is the result of a fetch,
   * not when the local queryClient has been updated by other means
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
            <Todo
              key={todoKey}
              todoKey={todoKey}
              todoMachineService={
                todoMachineService as unknown as TodoMachineType
              }
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
