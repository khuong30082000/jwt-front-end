import "./Login.scss";
import { useHistory } from "react-router-dom";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../../services/userService";
import { UserContext } from "../../context/UserContext";

function Login() {
  const { loginContext } = useContext(UserContext);
  const history = useHistory();

  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");
  const defaultObjValidInput = {
    isValidValueLogin: true,
    isValidPassword: true,
  };
  const [objValidInput, setObjValidInput] = useState(defaultObjValidInput);

  const handleCreateNewAccount = () => {
    history.push("/register");
  };

  const handleSubmitLogin = async () => {
    setObjValidInput(defaultObjValidInput);
    if (!valueLogin) {
      setObjValidInput({ ...defaultObjValidInput, isValidValueLogin: false });
      toast.error("Please enter your email address or phone number");
      return;
    }
    if (!password) {
      setObjValidInput({ ...defaultObjValidInput, isValidPassword: false });
      toast.error("Please enter your password");
      return;
    }
    let res = await loginUser(valueLogin, password);
    //SUCCESS
    if (res && +res.EC === 0) {
      let groupWithRoles = res.DT.groupWithRoles;
      let email = res.DT.email;
      let username = res.DT.username;
      let token = res.DT.access_token;
      let data = {
        isAuthenticated: true,
        token,
        account: { groupWithRoles, email, username },
      };

      localStorage.setItem("jwt", token);
      loginContext(data);
      history.push("/users");
      // window.location.reload(); //fixed Login Nav
    }
    //ERROR
    if (res && +res.EC !== 0) {
      toast.error(res.EM);
    }
  };

  const handlePressEnter = (e) => {
    if (e.code === "Enter" && e.charCode === 13) {
      handleSubmitLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="row px-3 px-sm-0">
          <div className="content-left col-sm-7 d-sm-block col-12 d-none">
            <div className="brand">Nguyen Trong Khuong</div>
            <div className="detail">Learning every thing</div>
          </div>

          <div className="content-right col-12 col-sm-5 d-flex flex-column gap-3 py-4">
            <div className="brand d-sm-none">Nguyen Trong Khuong</div>
            <input
              className={
                objValidInput.isValidValueLogin
                  ? "form-control"
                  : "is-invalid form-control"
              }
              type="text"
              placeholder="Inter your user"
              value={valueLogin}
              onChange={(e) => setValueLogin(e.target.value)}
            />
            <input
              className={
                objValidInput.isValidPassword
                  ? "form-control"
                  : "is-invalid form-control"
              }
              type="password"
              placeholder="Inter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => handlePressEnter(e)}
            />
            <button className="btn btn-primary" onClick={handleSubmitLogin}>
              Login
            </button>
            <span className="text-center">
              <a className="forgot-password" href="#">
                Forgot your password?
              </a>
            </span>
            <hr />
            <div className="text-center">
              <button
                className="btn btn-success"
                onClick={handleCreateNewAccount}
              >
                Create new account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
