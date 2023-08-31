import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllReviews } from "../../store/reviews";
import { getAllSpots } from "../../store/spots";
import "./SpotReviews.css";

function SpotReviews() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const reviewsList = useSelector((state) => Object.values(state.reviews.spot));
  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const spotList = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);
  return (
    <>
      <div className="line-break"></div>
      <div className="review-ticker">
        {/* {spotList.map(({ avgRating, userId }) => (
          <p key={userId}>{avgRating} * _ reviews </p>
        ))} */}
        <h2>Review Ticker</h2>
      </div>
    </>
  );
}
export default SpotReviews;
