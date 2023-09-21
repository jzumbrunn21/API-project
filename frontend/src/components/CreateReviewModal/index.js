import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { createNewReview, getAllReviews } from "../../store/reviews";
import { getSingleSpot } from "../../store/spots";
import "./CreateReviewModal.css";

import { FontAwesome, FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-solid-svg-icons";

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
  const currentUser = useSelector((state) => state.session.user || null);
  const reviews = useSelector((state) => state.reviews.spot || null);

  const [validationMessage, setValidationMessage] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
      resetModal();
    }
  };

  const isDuplicate = (reviews, currentUser) => {
    let reviewsArray = Object.values(reviews);
    for (const review of reviewsArray) {
      if (review.userId === currentUser.id) {
        return true;
      }
    }
    return false;
  };

  const duplicateCheck = isDuplicate(reviews, currentUser);
  const handleDisable = review.length < 10 || stars < 1;

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);

      if (review.length < 10) {
        setValidationMessage("Review must be longer than 10 characters");
      } else {
        setValidationMessage("");
      }
      setModalContent(
        <div ref={modalRef} className="create-review-container">
          <form id="form" onSubmit={handleSubmit}>
            <h2>How was your stay?</h2>
            <label className="review-input">
              {validationMessage && (
                <p className="validation-message">{validationMessage}</p>
              )}
              <textarea
                name="review"
                type="text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Leave your review here..."
              />
            </label>
            <label className="stars-input">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((index) => (
                  <span
                    key={index}
                    onClick={() => setStars(index)}
                    className={
                      index <= stars ? "star star-filled" : "star empty"
                    }
                  >
                    <FontAwesomeIcon
                      icon={index <= stars ? solidStar : emptyStar}
                    />
                  </span>
                ))}
                <div>{""} Stars</div>
              </div>
            </label>
            <button type="submit" disabled={handleDisable}>
              Submit Your Review
            </button>
          </form>
        </div>
      );
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      resetModal();
    }
  }, [isModalOpen, review, stars, validationMessage]);

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
      history.push(`/spots/${spotId}`);
    }, 1000);
    resetModal();
  };

  return (
    <>
      {duplicateCheck === false && (
        <button onClick={toggleModal} id="post-review-button">
          Post Your Review
        </button>
      )}
    </>
  );
}

export default CreateReviewModal;
