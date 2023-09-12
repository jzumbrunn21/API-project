import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewReview } from "../../store/reviews";
import { useParams } from "react-router-dom";
import "./CreateReviewModal.css";
import { useHistory } from "react-router-dom";

function CreateReviewModal() {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();
  const { spotId } = useParams();

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    setIsModalOpen(false);
    return dispatch(createNewReview({ review, stars }, spotId))
      .then((newReview) => {
        setReviews([...reviews, newReview]);
        closeModal();
        history.push(`/api/spots/${spotId}`);
      })
      // .catch(async (response) => {
      //   const data = await response.json();
      //   if (data && data.errors) {
      //     setErrors(data.errors);
      //   }
      // });
  };

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
