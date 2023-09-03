import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useHistory } from "react-router-dom";
import "./ProfileButton.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/");
  };

  const manageRedirect = (e) => {
    e.preventDefault();
    closeMenu();
    history.push("/api/spots/current");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu}>
        <i class="fa-solid fa-user"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <li className="dropdown-menu">
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <div className="line-break"></div>
            <li>
              <button className="cursor-pointer" onClick={manageRedirect}>
                Manage Spots
              </button>
            </li>
            <div className="line-break"></div>
            <li>
              <button className="cursor-pointer" onClick={logout}>
                Log Out
              </button>
            </li>
          </li>
        ) : (
          <>
            <div className="dropdown-menu">
              <div className="cursor-pointer">
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </div>
              <div className="cursor-pointer">
                <OpenModalMenuItem
                  className="cursor-pointer"
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </div>
            </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
