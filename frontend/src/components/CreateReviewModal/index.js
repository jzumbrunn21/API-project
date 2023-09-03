import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewReview } from "../../store/reviews";
import { useParams } from "react-router-dom";

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

  const openModal = () => {
    setModalContent(
      <form onSubmit={handleSubmit}>
        <h2>How was your stay?</h2>
        <input
          name="review"
          type="text"
          value={reviewSubmit.review}
          onChange={handleChange}
          placeholder="Leave your review here..."
        />
        <input
          name="stars"
          type="number"
          value={reviewSubmit.stars}
          onChange={handleChange}
          placeholder="Enter star rating (1-5)"
        />
        <button type="submit">Submit Your Review</button>
      </form>
    );
  };

  return <button onClick={openModal}>Post Your Review</button>;
}

export default CreateReviewModal;
