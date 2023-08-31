import React from "react";
import { useModal } from "../../context/Modal";

function DeleteSpotModal({ spotId, spotName, onDelete }) {
  const { setModalContent, setOnModalClose } = useModal();
  const openModal = () => {
    setModalContent(
      <>
        <h2>Confirm Delete</h2>
        <h4>Are you sure you want to remove this spot from the listings?</h4>
        <button
          onClick={() => {
            onDelete(spotId);
          }}
        >
          Yes (Delete Spot)
        </button>
        <button onClick={setOnModalClose}>No (Keep Spot)</button>
      </>
    );

    setOnModalClose(() => {
      setModalContent(null);
    });
  };
  return <li onClick={openModal}>Delete</li>;
}

export default DeleteSpotModal;
