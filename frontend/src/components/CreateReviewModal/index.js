import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewReview } from "../../store/reviews";
import { useParams } from "react-router-dom";
import "./CreateReviewModal.css";

function CreateReviewModal({ review }) {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();
  const { spotId } = useParams();

  // const [reviewText, setReviewText] = useState("");
  // const [stars, setStars] = useState(1);
  const [reviewSubmit, setReviewSubmit] = useState({
    review: "",
    stars: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      review: reviewSubmit.review,
      stars: reviewSubmit.stars,
    };

    await dispatch(createNewReview(newReview, spotId));

    closeModal();
  };
  const handleChange = (e) => {
    setReviewSubmit((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };
  // const handleDisable = review.length < 10;

  const openModal = () => {
    setModalContent(
      <div className="create-review-container">
        <form id="form" onSubmit={handleSubmit}>
          <h2>How was your stay?</h2>
          <div className="review-input">
            <textarea
              name="review"
              type="text"
              value={reviewSubmit.review}
              onChange={handleChange}
              placeholder="Leave your review here..."
            />
          </div>
          <div className="stars-input">
            <input
              name="stars"
              type="number"
              value={reviewSubmit.stars}
              onChange={handleChange}
              placeholder="Enter star rating (1-5)"
            />
          </div>
          <button type="submit">
            Submit Your Review
          </button>
        </form>
      </div>
    );
  };

  return (
    <button onClick={openModal} id="post-review-button">
      Post Your Review
    </button>
  );
}

export default CreateReviewModal;
