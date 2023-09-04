import React from "react";
import { useModal } from "../../context/Modal";
import "./DeleteSpotModal.css";

function DeleteSpotModal({ spotId, spotName, onDelete }) {
  const { setModalContent, setOnModalClose, closeModal } = useModal();
  const openModal = () => {
    setModalContent(null);

    setModalContent(
      <div className="delete-container">
        <div id="delete">
          <h2>Confirm Delete</h2>
        </div>
        <h4>Are you sure you want to remove this spot from the listings?</h4>
        <button id="confirm"
          onClick={() => {
            onDelete(spotId);
            closeModal();
          }}
        >
          Yes (Delete Spot)
        </button>
        <button id="deny" onClick={closeModal}>No (Keep Spot)</button>
      </div>
    );
  };
  return <button onClick={openModal}>Delete</button>;
}

export default DeleteSpotModal;
