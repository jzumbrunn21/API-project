import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewReview, getAllReviews } from "../../store/reviews";
import { useParams } from "react-router-dom";
import "./CreateReviewModal.css";
import { useHistory } from "react-router-dom";

function CreateReviewModal() {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();
  const { spotId } = useParams();

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(1);
  // const [reviews, setReviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();

  const reviews = useSelector((state) => state.reviews);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    setReview("");
    setStars(1);
    await dispatch(createNewReview({ review, stars }, spotId));
    dispatch(getAllReviews(spotId));
    setTimeout(() => {
      history.push(`/api/spots/${spotId}`);
    }, 1000);
    closeModal();
  };
  // useEffect(() => {
  // }, [spotId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button onClick={openModal} id="post-review-button">
        Post Your Review
      </button>
      {isModalOpen && (
        <div className="create-review-container">
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
      )}
    </>
  );
}

export default CreateReviewModal;
