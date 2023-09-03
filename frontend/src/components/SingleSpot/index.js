import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSpot } from "../../store/spots";
import { getAllReviews } from "../../store/reviews";
import { useParams } from "react-router-dom";
import CreateReviewModal from "../CreateReviewModal";
import "./SingleSpot.css";

function SingleSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const singleSpot = useSelector((state) => state.spots.singleSpot);
  const currentUser = useSelector((state) => state.session.user || null);

  const {
    name,
    city,
    state,
    country,
    previewImage,
    price,
    ownerId,

    description,
    SpotImages,
    Owner,
  } = singleSpot;
  const [avgStarRating, setAvgStarRating] = useState(singleSpot.avgStarRating);
  const [numReviews, setNumReviews] = useState(singleSpot.numReviews);

  useEffect(() => {
    dispatch(getSingleSpot(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    setAvgStarRating(singleSpot.avgStarRating);
    setNumReviews(singleSpot.numReviews);
  }, [singleSpot]);

  const handleReservationClick = (e) => {
    e.preventDefault();
    alert("Feature Coming Soon!");
  };

  return (
    <>
      <h2>{name}</h2>
      <h4>
        {city}, {state}, {country}
      </h4>
      {SpotImages && SpotImages.length > 0 && (
        <ul className="spot-images">
          {SpotImages.map(({ id, url }) => (
            <li key={id} className="spot-image">
              <img src={url} alt={`Spot ${id}`} />
            </li>
          ))}
        </ul>
      )}
      {Owner && (
        <h3>
          Hosted by {Owner.firstName} {Owner.lastName}
        </h3>
      )}
      <p>{description}</p>
      <div className="reservation-details">
        <p>STARIMAGE</p>
        <p>${price} night</p>
        <p>{avgStarRating}</p>
        <p>{numReviews} reviews</p>
        <button id="reserve-button" onClick={handleReservationClick}>
          Reserve
        </button>
      </div>
      <div className="line-break"></div>
      <div className="reviews-ticker">
        {currentUser === null && numReviews > 0 ? (
          <>
            <p>STARIMAGE</p>
            <p>Stars: {avgStarRating}</p>
            <p>*</p>
            <p>{numReviews} reviews</p>
          </>
        ) : numReviews < 1 ? (
          <>
            <p>STARIMAGE</p>
            <p>New</p>
            {!Owner || (currentUser !== null && currentUser.id !== Owner.id) ? (
              <>
                <CreateReviewModal />
              </>
            ) : null}
          </>
        ) : numReviews > 0 ? (
          <>
            <p>STARIMAGE</p>
            <p>Stars: {avgStarRating}</p>
            <p>*</p>
            <p>{numReviews} reviews</p>
            {!Owner || (currentUser !== null && currentUser.id !== Owner.id) ? (
              <>
                <CreateReviewModal />
              </>
            ) : null}
          </>
        ) : // : currentUser !== null &&
        //   numReviews > 0 &&
        //   Owner &&
        //   currentUser.id === Owner.id ? (
        //   <>
        //     <p>STARIMAGE</p>
        //     <p>Stars: {avgStarRating}</p>
        //     <p>*</p>
        //     <p>{numReviews} reviews</p>
        //   </>
        // )
        null}
      </div>
    </>
  );
}

export default SingleSpot;
