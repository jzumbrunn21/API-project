import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { csrfFetch } from "../../store/csrf";
import { useHistory } from "react-router-dom";
import DeleteSpotModal from "../DeleteSpotModal";
import { useModal } from "../../context/Modal";

function ManageSpots() {
  const [currentSpots, setCurrentSpots] = useState([]);
  // const [deleteModalOn, setDeleteModalOn] = useState(false);
  // const [deletedSpot, setDeletedSpot] = useState({});
  const { closeModal } = useModal();
  const history = useHistory();

  useEffect(() => {
    async function fetchSpots() {
      const response = await csrfFetch("/api/spots/current");
      //   console.log("api Response:", response);
      const responseData = await response.json();
      setCurrentSpots(responseData.Spots);
    }
    fetchSpots();
  }, []);
  const handleCreateSpot = (e) => {
    e.preventDefault();
    history.push("/api/spots/new");
  };

  // const openModal = (spotId, spotName) => {
  //   setDeleteModalOn(true);
  //   setDeletedSpot({ id: spotId, name: spotName });
  // };
  // const closeModal = () => {
  //   setDeleteModalOn(false);
  //   setDeletedSpot({});
  // };
  const handleDeleteSpot = async (spotId) => {
    const response = await csrfFetch(`/api/spots/${spotId.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setCurrentSpots(currentSpots.filter((spot) => spot.id !== spotId.id));
    }
    closeModal();
  };

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
                <button>Update</button>
                <DeleteSpotModal
                  spotId={id}
                  spotName={name}
                  onClick={handleDeleteSpot}
                />
              </li>
            )
          )}
        </ul>
      ) : (
        <div>
          <button onClick={handleCreateSpot}>Create a New Spot</button>
        </div>
      )}
    </>
  );
}

export default ManageSpots;
