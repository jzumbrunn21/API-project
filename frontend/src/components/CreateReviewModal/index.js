import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewReview } from "../../store/reviews";

function CreateReviewModal() {
  const { setModalContent, closeModal } = useModal();
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(
      createNewReview({
        review,
        stars,
      })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const openModal = () => {
    setModalContent(null);

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
            type="text"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
          />
          <button type="submit">Submit Your Review</button>
        </form>
      </>
    );
  };
  //   return setErrors({

  //   })
  return <button onClick={openModal}>Post Your Review</button>;
}

export default CreateReviewModal;
