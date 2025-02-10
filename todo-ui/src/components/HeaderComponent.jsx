import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isUserLoggedIn, logout } from "../services/AuthService";

const HeaderComponent = () => {
  const isAuth = isUserLoggedIn();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleShutdown = async () => {
    try {
      const response = await fetch("http://localhost:8080/actuator/shutdown", {
        method: "POST",
      });
      if (response.ok) {
        navigate("/thanks");
      } else {
        alert("Shutdown failed!");
      }
    } catch (error) {
      alert("Error shutting down the application.");
      console.error(error);
    }
  };

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark position-relative">
          <div className="container">
            <div className="navbar-brand title-animation">
              Business Collection Management
            </div>
            <ul className="navbar-nav ms-auto">
              {isAuth && (
                <li className="nav-item">
                  <NavLink to="/todos" className="nav-link">
                    Main Panel
                  </NavLink>
                </li>
              )}
              {isAuth && (
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )}
              {!isAuth && (
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </nav>
        <button
          className="shutdown-button position-fixed top-0 start-0 m-2"
          title="Shutdown"
          onClick={handleShutdown}
        >
          ⏻
        </button>
      </header>
      <style>
        {`
          .shutdown-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: red;
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            transition: background-color 0.3s ease-in-out;
          }
          .shutdown-button:hover {
            background-color: darkred;
          }
        `}
      </style>
    </div>
  );
};

export default HeaderComponent;
