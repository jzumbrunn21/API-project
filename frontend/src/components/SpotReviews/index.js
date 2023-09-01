import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "../../store/reviews";
import { useParams } from "react-router-dom";

import "./SpotReviews.css";

function SpotReviews() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  useEffect(() => {
    dispatch(getAllReviews(spotId));
  }, [dispatch, spotId]);

  const reviews = useSelector((state) => state.reviews.spot);

  const avgRating = (reviews) => {
    if (!reviews || Object.keys(reviews).length === 0) {
      return 0;
    }
    let sum = 0;
    console.log(sum);
    Object.values(reviews).forEach((review) => {
      review.stars += sum;
    });
    let avg = sum / Object.keys(reviews).length;
    console.log("avg", avg);
    return avg;
    // return 1;
  };

  return (
    <>
      <div className="line-break"></div>
      <div className="reviews-ticker">
        <p>STARIMAGE</p>
        <p>
          Stars: {avgRating(reviews)}
          {console.log(avgRating)}
        </p>
        <p>*</p>
        <p>{Object.keys(reviews).length} reviews</p>
      </div>
      <div className="review-container">
        {/* <p>{FIRSTNAME}</p> */}
        {/* <p>{DATE}</p> */}
        {/* <p>{REVIEW}</p> */}
      </div>
    </>
  );
}
export default SpotReviews;
