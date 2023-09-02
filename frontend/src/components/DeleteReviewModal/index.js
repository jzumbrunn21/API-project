import React from "react";
import { useModal } from "../../context/Modal";

function DeleteReviewModal({ reviewId, onDelete }) {
  const { setModalContent, setOnModalClose, closeModal } = useModal();
  const openModal = () => {
    setModalContent(null);

    setModalContent(
      <>
        <h2>Confirm Delete</h2>
        <h4>Are you sure you want to remove this review?</h4>
        <button
          onClick={() => {
            onDelete(reviewId);
            closeModal();
          }}
        >
          Yes (Delete Review)
        </button>
        <button onClick={closeModal}>No (Keep Review)</button>
      </>
    );
  };
  return <button onClick={openModal}>Delete</button>;
}

export default DeleteReviewModal;
