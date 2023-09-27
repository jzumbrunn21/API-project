// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "./bnb_logo.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="navigation-header-container">
      <ul className="navigation-spotsList">
        <li>
          <NavLink exact to="/">
            <img id="home-image" src={logo} alt="Bnb Logo" />
          </NavLink>
        </li>
        <div id="navigation-header-right">
          {sessionUser && (
            <li>
              <NavLink id="nav-create-spot" exact to="/spots/new">
                Create New Spot
              </NavLink>
            </li>
          )}
          {isLoaded && (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )}
        </div>
      </ul>
    </div>
  );
}

export default Navigation;
