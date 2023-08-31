import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { csrfFetch } from "../../store/csrf";

function ManageSpots() {
  const [currentSpots, setCurrentSpots] = useState([]);

  useEffect(() => {
    async function fetchSpots() {
      const response = await csrfFetch("/api/spots/current");
      //   console.log("api Response:", response);
      const responseData = await response.json();
      setCurrentSpots(responseData.Spots);
    }
    fetchSpots();
  }, []);

  return (
    <>
      <h1>Manage Your Spots</h1>

      {currentSpots.length > 0 ? (
        <ul className="spots-list">
          {currentSpots.map(
            ({ id, previewImage, city, state, price, avgRating, name }) => (
              <li key={id} className="single-spot">
                <Link exact to={`/api/spots/${id}`}>
                  <img
                    src={previewImage}
                    alt={`Spot ${id}`}
                    data-tooltip-id="tooltip"
                    data-tooltip-content={name}
                    data-tooltip-place="top"
                  />
                </Link>
                <p className="spot-info">
                  {city},{state}
                </p>
                <p className="spot-info">${price} night</p>
                <p className="spot-info">{avgRating || "New"}</p>
              </li>
            )
          )}
        </ul>
      ) : (
        <div>
          <button>Create a New Spot</button>
        </div>
      )}
    </>
  );
}

export default ManageSpots;
