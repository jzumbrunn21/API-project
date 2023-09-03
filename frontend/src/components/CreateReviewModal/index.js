import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewReview } from "../../store/reviews";
import { useParams } from "react-router-dom";

function CreateReviewModal() {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const { spotId } = useParams();

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      review,
      stars,
    };

    await dispatch(createNewReview(newReview, spotId));

    // setModalContent(null);
  };

  const openModal = () => {
    setModalContent(
      <>
        <h2>How was your stay?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Leave your review here..."
          />
          <input
            type="number"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            placeholder="Enter star rating (1-5)"
          />
          <button type="submit">Submit Your Review</button>
        </form>
      </>
    );
  };

  return <button onClick={openModal}>Post Your Review</button>;
}

export default CreateReviewModal;
