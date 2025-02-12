import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isUserLoggedIn, logout } from "../services/AuthService";
import { FaPowerOff } from "react-icons/fa";

const HeaderComponent = () => {
  const isAuth = isUserLoggedIn();
  const navigate = useNavigate();
  const inactivityTimer = useRef(null);

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
        navigate("/thanks");
      }
    } catch (error) {
      alert("Error shutting down the application.");
      navigate("/thanks");
      console.error(error);
    }
  };

  const resetTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      alert("No activity detected for 10 minutes. Shutting down...");
      handleShutdown();
    }, 10 * 60 * 1000); // 10 minutes inactivity
  };

  useEffect(() => {
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keydown", resetTimer);
    document.addEventListener("click", resetTimer);
    document.addEventListener("scroll", resetTimer);
    resetTimer();

    return () => {
      document.removeEventListener("mousemove", resetTimer);
      document.removeEventListener("keydown", resetTimer);
      document.removeEventListener("click", resetTimer);
      document.removeEventListener("scroll", resetTimer);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark position-relative">
          <div className="container">
            <div className="navbar-brand title-animation">
              Bicee Sphere Application
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
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                  >
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
          onClick={handleShutdown} // Corrected onClick syntax
          title="Shutdown"
        >
          <FaPowerOff />
        </button>
      </header>
      <style>
        {`
          .shutdown-button {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: red;
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
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
