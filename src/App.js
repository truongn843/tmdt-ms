import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Router } from "react-router";
import { renderRoutes } from "react-router-config";
import { createBrowserHistory } from "history";
import routes from "./router";



const history = createBrowserHistory();

function App() {
  return (
    <div>
      <Router history={history}>{renderRoutes(routes)}</Router>
    </div>
  );
}
export default App;
