import React from "react";
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";

function DeleteReviewModal({ reviewId, onDelete }) {
  const { setModalContent, setOnModalClose, closeModal } = useModal();
  const openModal = () => {
    setModalContent(null);

    setModalContent(
      <div className="delete-container">
        <div id="delete">
          <h2>Confirm Delete</h2>
        </div>
        <h4>Are you sure you want to remove this review?</h4>
        <button
          id="confirm"
          onClick={() => {
            onDelete(reviewId);
            closeModal();
          }}
        >
          Yes (Delete Review)
        </button>
        <button id="deny" onClick={closeModal}>
          No (Keep Review)
        </button>
      </div>
    );
  };
  return <button onClick={openModal} id='manage-delete-button'>Delete</button>;
}

export default DeleteReviewModal;
