import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews, deleteReview } from "../../store/reviews";
// import * as sessionActions from "../../store/session";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import DeleteReviewModal from "../DeleteReviewModal";
import { getSingleSpot } from "../../store/spots";

import "./SpotReviews.css";
import { useHistory } from "react-router-dom";

function SpotReviews() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const reviews = useSelector((state) => state.reviews.spot || []);
  const currentUser = useSelector((state) => state.session.user || null);
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(getAllReviews(spotId)).then(() => {
      setLoaded(true);
    });
  }, [dispatch, spotId]);

  const currentSpotReviews = Object.values(reviews).filter(
    (review) => review.spotId === parseInt(spotId)
  );

  const handleDeleteReview = async (reviewId) => {
    dispatch(deleteReview(reviewId));

    dispatch(getSingleSpot(spotId));

    closeModal();
    setTimeout(() => {
      history.push(`/api/spots/${spotId}`);
    }, 1000);
  };
  return (
    <div className="reviews-container-2">
      {currentSpotReviews && currentSpotReviews.length > 0 ? (
        <div className="reviews-list">
          {currentSpotReviews.map((review) => (
            <div key={review.id}>
              <h3>{review.User.firstName}</h3>
              <h5>
                {new Date(review.createdAt).toLocaleString("default", {
                  month: "long",
                })}
                {""} {new Date(review.createdAt).getFullYear()}
              </h5>
              <h5>{review.review}</h5>
              {currentUser !== null && review.User.id === currentUser.id ? (
                <DeleteReviewModal
                  reviewId={review.id}
                  onDelete={handleDeleteReview}
                />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
export default SpotReviews;
