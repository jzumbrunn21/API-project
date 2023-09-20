import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "./SpotsList.css";

function SpotsList() {
  const dispatch = useDispatch();
  const spotList = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <ul className="spots-list">
        {spotList.map(
          ({ id, previewImage, city, state, price, avgRating, name }) => (
            <li key={id} className="single-spot">
              <Link exact to={`/spots/${id}`}>
                <img
                  className="spotImage"
                  src={previewImage}
                  alt={`Spot ${id}`}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={name}
                  data-tooltip-place="top"
                />
              </Link>
              <div className="spot-info">
                <p id="city-state">
                  {city}, {state}
                </p>
                <p id="price">${price} night</p>
                <p id="avgRating">
                  <i className="fa-solid fa-star"></i>
                  {avgRating === null
                    ? "New"
                    : parseFloat(avgRating).toFixed(1)}
                </p>
              </div>
            </li>
          )
        )}
      </ul>
      <Tooltip id="tooltip" />
    </>
  );
}

export default SpotsList;
