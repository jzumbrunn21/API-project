import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "../../store/reviews";
import { useParams } from "react-router-dom";

import "./SpotReviews.css";

function SpotReviews() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllReviews(spotId));
  }, spotId);

  const reviews = useSelector((state) => state.reviews.spot);
  return (
    <>
      <div className="line-break"></div>
      <div className="reviews-ticker">
        <p>STARIMAGE</p>
        <p>{AVGRATING}</p>
        <p>*</p>
        <p>{NUMREVIEWS} reviews</p>
      </div>
      <div className="review-container">
        <p>{FIRSTNAME}</p>
        <p>{DATE}</p>
        <p>{REVIEW}</p>
      </div>
    </>
  );
}
export default SpotReviews;
