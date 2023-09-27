// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="header-container">
      <ul className="navigation-spotsList">
        <li>
          <NavLink exact to="/">
            <img
              id="home-image"
              src="https://img.icons8.com/?size=512&id=63956&format=png"
              alt="Bnb Logo"
            />
          </NavLink>
        </li>
        <div id="header-right">
          {sessionUser && (
            <li>
              <NavLink exact to="/spots/new">
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
