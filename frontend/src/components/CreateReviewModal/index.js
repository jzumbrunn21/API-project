import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { createNewReview, getAllReviews } from "../../store/reviews";
import { getSingleSpot } from "../../store/spots";
import "./CreateReviewModal.css";

function CreateReviewModal() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const history = useHistory();
  const { setModalContent, closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(1);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
      resetModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      setModalContent(
        <div ref={modalRef} className="create-review-container">
          <form id="form" onSubmit={handleSubmit}>
            <h2>How was your stay?</h2>
            <label className="review-input">
              <textarea
                name="review"
                type="text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Leave your review here..."
              />
            </label>
            <label className="stars-input">
              <input
                name="stars"
                type="number"
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                placeholder="Enter star rating (1-5)"
              />
            </label>
            <button type="submit">Submit Your Review</button>
          </form>
        </div>
      );
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      resetModal();
    }
  }, [isModalOpen, review, stars]);

  const resetModal = () => {
    setIsModalOpen(false);
    setReview("");
    setStars(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    await dispatch(createNewReview({ review, stars }, spotId));
    dispatch(getAllReviews(spotId));
    dispatch(getSingleSpot(spotId));

    setTimeout(() => {
      closeModal();
      history.push(`/api/spots/${spotId}`);
    }, 1000);
    resetModal();
  };

  return (
    <>
      <button onClick={toggleModal} id="post-review-button">
        Post Your Review
      </button>
    </>
  );
}

export default CreateReviewModal;
