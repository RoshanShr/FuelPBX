import { createBrowserRouter } from "react-router-dom";
import AuthHandler from "../common/AuthHandler.jsx";
import Login from "../components/Login/";
import Register from "../components/Register";
import Clients from "../components/Clients";
import Reports from "../components/Reports";
import PageNotFound from "../components/404";
import Private from "../components/Private";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthHandler component={Login} authRequired={false} />,
  },
  {
    path: "/login",
    element: <AuthHandler component={Login} authRequired={false} />,
  },
  {
    path: "/logout",
    element: <AuthHandler component={Login} authRequired={false} />,
  },
  {
    path: "/register",
    element: <AuthHandler component={Register} authRequired={false} />,
  },
  {
    path: "/reports",
    element: (
      <AuthHandler
        component={() => <Private Component={Reports} />}
        authRequired={true}
      />
    ),
  },
  {
    path: "/clients",
    element: (
      <AuthHandler
        component={() => <Private Component={Clients} />}
        authRequired={true}
      />
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default routes;
