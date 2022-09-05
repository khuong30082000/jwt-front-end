import { Switch, Route } from "react-router-dom";
import GroupRole from "../components/GroupRole/GroupRole";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Role from "../components/Role/Role";
import Users from "../components/Users/Users";
import PrivateRoutes from "./PrivateRoutes";
const AppRoutes = () => {
  const Projects = () => {
    return (
      <>
        <span>project</span>
      </>
    );
  };

  return (
    <>
      <Switch>
        <Route path="/" exact>
          Home
        </Route>

        <PrivateRoutes path="/users" compunent={Users} />
        <PrivateRoutes path="/projects" compunent={Projects} />
        <PrivateRoutes path="/roles" compunent={Role} />
        <PrivateRoutes path="/group-role" compunent={GroupRole} />

        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>

        <Route path="*">404 Not Found </Route>
      </Switch>
    </>
  );
};
export default AppRoutes;
