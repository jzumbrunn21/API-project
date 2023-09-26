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
  const [updatedReviews, setUpdatedReviews] = useState([]);


  useEffect(() => {
    setUpdatedReviews(reviews);
    dispatch(getAllReviews(spotId));
    setLoaded(true);
  }, [dispatch, spotId]);

  const currentSpotReviews = Object.values(updatedReviews).filter(
    (review) => review.spotId === parseInt(spotId)
  );
  const currentSpotReviewsReverse = currentSpotReviews.reverse();

  const handleDeleteReview = async (reviewId) => {
    dispatch(deleteReview(reviewId));

    dispatch(getSingleSpot(spotId));

    closeModal();
    setTimeout(() => {
      history.push(`/spots/${spotId}`);
    }, 1000);
  };
  // console.log("currentspot reviews", currentSpotReviewsReverse);
  if (loaded) {
    return <div></div>;
  }
  return (
    <div className="reviews-container-2">
      {currentSpotReviewsReverse && currentSpotReviewsReverse.length > 0 ? (
        <div className="reviews-list">
          {currentSpotReviewsReverse.map((review) => (
            <div key={review.id}>
              {/* {console.log("current review", review)} */}
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
