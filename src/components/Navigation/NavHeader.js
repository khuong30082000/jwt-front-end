import "./Nav.scss";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../../logo.svg";
import { logoutUser } from "../../services/userService";
import { toast } from "react-toastify";

function NavHeader() {
  const { user, logoutContext } = useContext(UserContext);
  const location = useLocation();
  const history = useHistory();

  const handleLogOut = async () => {
    let data = await logoutUser(); //clear cookie
    localStorage.removeItem("jwt"); //clear localstorage
    logoutContext(); //clear user in context

    if (data && data.EC === 0) {
      toast.success("Log out succeeds...");
      history.push("/login");
    } else {
      toast.error(data.EM);
    }
  };

  if ((user && user.isAuthenticated === true) || location.pathname === "/") {
    return (
      <div className="nav-header">
        {/* <ul className="nav">
          <li>
            <NavLink to="/" exact>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/users">users</NavLink>
          </li>
          <li>
            <NavLink to="/projects">projects</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul> */}
        <Navbar bg="header">
          <Container>
            <Navbar.Brand href="#home">
              <img
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              JWT Project
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <NavLink to="/" exact className="nav-link">
                  Home
                </NavLink>
                <NavLink to="/users" className="nav-link">
                  Users
                </NavLink>
                <NavLink to="/projects" className="nav-link">
                  Projects
                </NavLink>
                <NavLink to="/about" className="nav-link">
                  About
                </NavLink>
              </Nav>
              <Nav>
                {user && user.isAuthenticated === true ? (
                  <>
                    <Nav.Item className="nav-link">
                      Welcome: {user.account.username}
                    </Nav.Item>
                    <NavDropdown title="Settings" id="basic-nav-dropdown">
                      <NavDropdown.Item>Change Password</NavDropdown.Item>

                      <NavDropdown.Divider />
                      <NavDropdown.Item>
                        <span onClick={handleLogOut}> Log out</span>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  } else {
    return <></>;
  }
}

export default NavHeader;
