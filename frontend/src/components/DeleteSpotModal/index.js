import React from "react";
import { useModal } from "../../context/Modal";

function DeleteSpotModal({ spotId, spotName, onDelete }) {
  const { setModalContent, setOnModalClose, closeModal } = useModal();
  const openModal = () => {
    setModalContent(null);

    setModalContent(
      <>
        <h2>Confirm Delete</h2>
        <h4>Are you sure you want to remove this spot from the listings?</h4>
        <button
          onClick={() => {
            onDelete(spotId);
            closeModal();
          }}
        >
          Yes (Delete Spot)
        </button>
        <button onClick={closeModal}>No (Keep Spot)</button>
      </>
    );
  };
  return <button onClick={openModal}>Delete</button>;
}

export default DeleteSpotModal;
