import { useEffect, useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoutes = ({ path, compunent }) => {
  const history = useHistory();
  const { user } = useContext(UserContext);

  if (user && user.isAuthenticated === true) {
    return (
      <>
        <Route path={path} component={compunent} />
      </>
    );
  } else {
    return <Redirect to="/login"></Redirect>;
  }
};

export default PrivateRoutes;
