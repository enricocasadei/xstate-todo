import { assign, createMachine } from "xstate";
import { QueryCache } from "react-query";
import { uuid } from "uuidv4";

export const queryCache = new QueryCache();

const updateTodoDoneInApi = (context: any, event: any) => {
  return new Promise((resolve) => {
    console.log("changing todo status in API");
    setTimeout(
      () => resolve({ ...event.todoItem, done: !event.todoItem.done }),
      500
    );
  });
};

const deleteTodo = (context: any, event: any) => {
  return new Promise((resolve) => {
    console.log("deleting todo from API");
    setTimeout(() => resolve({ success: true, id: event.todoItem.id }), 500);
  });
};

const addTodo = (context: any, event: any) => {
  return new Promise((resolve) => {
    console.log("creating todo in API");
    setTimeout(
      () => resolve({ id: uuid(), title: event.newTodoTitle, done: false }),
      500
    );
  });
};

export const todoMachine = createMachine(
  {
    id: "todoMachine",
    initial: "initialising",
    context: {
      todos: {},
    },
    on: {
      // permanently listen to data updates from react-query
      DATA_UPDATE: { actions: "updateData" },
    },
    states: {
      initialising: {
        on: {
          // first data received from react-query will move machine to idle
          DATA_UPDATE: {
            actions: "updateData",
            target: "idle",
          },
          DATA_LOAD_ERROR: "dataLoadingError",
        },
      },
      idle: {
        on: {
          ADD_TODO: "addingTodo",
          TOGGLE_TODO_DONE: "togglingTodoDone",
          TODO_DELETED: "deletingTodo",
        },
      },
      togglingTodoDone: {
        invoke: {
          src: updateTodoDoneInApi,
          onDone: { target: "idle", actions: ["updateTodoInQueryCache"] },
          onError: "idle",
        },
      },
      deletingTodo: {
        invoke: {
          src: deleteTodo,
          onDone: { target: "idle", actions: ["deleteTodoFromQueryCache"] },
          onError: "idle",
        },
      },
      addingTodo: {
        invoke: {
          src: addTodo,
          onDone: { target: "idle", actions: ["addTodoInQueryCache"] },
          onError: "idle",
        },
      },
      dataLoadingError: {
        on: {
          DATA_UPDATE: {
            actions: "updateData",
            target: "idle",
          },
        },
      },
    },
  },
  {
    actions: {
      updateData: assign({
        todos: (_, event: any) => {
          console.log("storing data from react-query in state machine");
          return event.data;
        },
      }),
      /**
       * The actions below take what is returned from the API and directly
       * merge the changes into the local query cache. This prevents a double
       * fetch of the entire set of Todos.
       */
      updateTodoInQueryCache: (context: any, event: any) => {
        // get current query data
        const todos = queryCache.get("todos");

        todos[event.data.id] = event.data;

        queryCache.setQueryData("todos", todos);
      },

      deleteTodoFromQueryCache: (context: any, event: any) => {
        const todos = queryCache.get("todos");

        delete todos[event.data.id];

        queryCache.setQueryData("todos", todos);
      },
      addTodoInQueryCache: (context: any, event: any) => {
        console.log("adding todo in query cache");
        const todos = queryCache.get("todos");

        todos[event.data.id] = event.data;

        queryCache.setQueryData("todos", todos);
      },
    },
  }
);
