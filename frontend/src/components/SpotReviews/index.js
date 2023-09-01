import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearReviews, getAllReviews } from "../../store/reviews";
import { useParams } from "react-router-dom";

import "./SpotReviews.css";

function SpotReviews() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const reviews = useSelector((state) => state.reviews.spot || []);

  useEffect(() => {
    dispatch(getAllReviews(spotId));
  }, [dispatch, spotId]);

  console.log("reviews,", reviews);
  const currentSpotReviews = Object.values(reviews).filter(
    (review) => review.spotId === parseInt(spotId)
  );
  console.log(currentSpotReviews);
  return (
    <>
      {currentSpotReviews && currentSpotReviews.length > 0 ? (
        <ul className="reviews-list">
          <h1>Reviews Below</h1>
          {currentSpotReviews.map((review) => (
            <li key={review.id}>
              <h3>{review.User.firstName}</h3>
              <h5>{review.createdAt}</h5>
              <h5>{review.review}</h5>
            </li>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </>
  );
}
export default SpotReviews;
