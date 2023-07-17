import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import "./main.css";

function Main() {
  const navigate = useNavigate();

  const handleLogOutClick = () => {
    localStorage.clear();
    navigate("/Sign_in");
  };


  return (
    <div className="main_page_container">
      <h1>Welcome to your main page, {localStorage.getItem("userName")}!</h1>
      <div className="main_page_button_container">
        <button
          className="btn btn-primary main_page_button"
          value="log out"
          onClick={handleLogOutClick}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Main;
