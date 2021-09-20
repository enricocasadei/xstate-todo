import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Counter } from "../View/Counter";
import { Temperature } from "../View/Temperature";
import { Payment } from "../View/Payment";

export function AppRouter() {
  return (
    <Router>
      <div style={{ width: "100%" }}>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            width: "100%",
            gap: "25px",
          }}
        >
          <li style={{ display: "flex" }}>
            <Link to="/counter">Counter</Link>
          </li>
          <li>
            <Link to="/temperature">Temperature</Link>
          </li>
          <li>
            <Link to="/payment">Payment</Link>
          </li>
        </ul>

        <hr />

        <Switch>
          <Route path="/counter">
            <Counter />
          </Route>
          <Route path="/temperature">
            <Temperature />
          </Route>
          <Route path="/payment">
            <Payment />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
