import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/helper/ProtectedRoutes";
import Base from "./components/chat/Base";
import Main from "./components/entryPage/Main";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <ProtectedRoute path="/user/chat" exact component={Base} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
