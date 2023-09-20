import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getSingleSpot } from "../../store/spots";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { csrfFetch } from "../../store/csrf";
import { useHistory } from "react-router-dom";
import DeleteSpotModal from "../DeleteSpotModal";
import { useModal } from "../../context/Modal";
import { deletedSpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import "./ManageSpots.css";

function ManageSpots() {
  const [currentSpots, setCurrentSpots] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();
  const dispatch = useDispatch();
  const singleSpot = useSelector((state) => state.spots.singleSpot);
  const { spotId } = useParams();

  // useEffect(() => {
  //   if (singleSpot) {
  //     const spotId = singleSpot.spotId;
  //   }
  // }, [singleSpot]);
  useEffect(() => {
    async function fetchSpots() {
      const response = await csrfFetch("/api/spots/current");
      
      const responseData = await response.json();
      setCurrentSpots(responseData.Spots);
    }
    fetchSpots();
  }, []);
  const handleCreateSpot = (e) => {
    e.preventDefault();
    history.push("/spots/new");
  };
  const handleUpdateSpot = (id) => {
    // e.preventDefault();
    history.push(`/spots/${id}/edit`);
  };

  const handleDeleteSpot = async (spotId) => {
    dispatch(deletedSpot(spotId));
    setCurrentSpots((spots) => spots.filter((spot) => spot.id !== spotId));
    closeModal();
    setTimeout(() => {
      history.push("/spots/current");
    }, 1000);
    // }
  };

  return (
    <div className="manage-container">
      <h1>Manage Your Spots</h1>
      <button id="create-spot" onClick={handleCreateSpot}>
        Create a New Spot
      </button>

      {currentSpots.length > 0 ? (
        <ul className="spots-list">
          {currentSpots.map(
            ({ id, previewImage, city, state, price, avgRating, name }) => (
              <li key={id} className="single-spot">
                <Link to={`/spots/${id}`}>
                  <img
                    id="manage-spot-images"
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
                    <i class="fa-solid fa-star"></i>
                    {avgRating === null
                      ? "New"
                      : parseFloat(avgRating).toFixed(1)}
                  </p>
                </div>

                <button
                  className="buttons"
                  onClick={() => handleUpdateSpot(id)}
                >
                  Update
                </button>
                <DeleteSpotModal
                  spotId={id}
                  spotName={name}
                  onDelete={handleDeleteSpot}
                />
              </li>
            )
          )}
        </ul>
      ) : null}
      <Tooltip id="tooltip" />
    </div>
  );
}

export default ManageSpots;
