import { queryClient } from "../../domain/todo";

/**
 * Mock ToDo API: To make sure local changes are not overwritten
 * the mock API gets the data from the query cache (which would
 * in reality never happen)
 */
export const fetchTodos = () => {
  return new Promise((resolve, reject) => {
    const shouldFail = Math.random() > 0.9;
    setTimeout(() => {
      if (shouldFail) {
        reject();
      } else {
        const todos = queryClient.getQueryData("todos");
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
