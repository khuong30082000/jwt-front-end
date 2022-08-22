import "./Register.scss";
import { useHistory } from "react-router-dom";
import { registerNewUser } from "../../services/userService";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const defaultValidInput = {
    isValidEmail: true,
    isValidPhone: true,
    isValidUsername: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
  };
  const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

  const history = useHistory();
  const handleLogin = () => {
    history.push("/Login");
  };

  useEffect(() => {}, []);

  const isValid = () => {
    setObjCheckInput(defaultValidInput);

    if (!email) {
      toast.error("Email is required!");
      setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
      return false;
    }

    let regx = /\S+@\S+\.\S+/;
    if (!regx.test(email)) {
      setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
      toast.error("Please enter a vailid email address!");
      return false;
    }

    if (!phone) {
      toast.error("Phone is required!");
      setObjCheckInput({ ...defaultValidInput, isValidPhone: false });
      return false;
    }
    if (!password) {
      toast.error("Password is required!");
      setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
      return false;
    }
    if (!username) {
      toast.error("Username is required!");
      setObjCheckInput({ ...defaultValidInput, isValidUsername: false });
      return false;
    }
    if (password != confirmPassword) {
      toast.error("Your pass word is not same!");
      setObjCheckInput({ ...defaultValidInput, isValidConfirmPassword: false });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    let check = isValid();
    if (check === true) {
      let serverData = await registerNewUser(email, phone, username, password);

      if (+serverData.EC === 0) {
        toast.success(serverData.EM, { position: "top-right" });
        history.push("/login");
      } else {
        toast.error(serverData.EM, { position: "top-right" });
      }
    }
  };
  return (
    <div className="register-container">
      <div className="container">
        <div className="row px-3 px-sm-0">
          <div className="content-left col-sm-7 d-sm-block col-12 d-none">
            <div className="brand">Nguyen Trong Khuong</div>
            <div className="detail">Learning every thing</div>
          </div>

          <div className="content-right col-12 col-sm-5 d-flex flex-column gap-3 py-4">
            <div className="brand d-sm-none">Nguyen Trong Khuong</div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className={
                  objCheckInput.isValidEmail
                    ? "form-control"
                    : "form-control is-invalid"
                }
                id="email"
                placeholder="Enter email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                className={
                  objCheckInput.isValidPhone
                    ? "form-control"
                    : "form-control is-invalid"
                }
                id="phone"
                placeholder="Enter phone"
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                className={
                  objCheckInput.isValidUsername
                    ? "form-control"
                    : "form-control is-invalid"
                }
                id="username"
                placeholder="Enter username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className={
                  objCheckInput.isValidPassword
                    ? "form-control"
                    : "form-control is-invalid"
                }
                id="passdword"
                placeholder="Enter password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="repassword">Re-enter Password:</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                className={
                  objCheckInput.isValidConfirmPassword
                    ? "form-control"
                    : "form-control is-invalid"
                }
                id="repassdword"
                placeholder="Enter Re password"
              />
            </div>

            <button className="btn btn-primary" onClick={handleRegister}>
              Register
            </button>

            <hr />
            <div className="text-center">
              <button className="btn btn-success" onClick={handleLogin}>
                Already've an account.Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
