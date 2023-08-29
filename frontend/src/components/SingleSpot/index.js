import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import "./SingleSpot.css";

function SingleSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const singleSpot = useSelector((state) => state.spots.singleSpot);
  useEffect(() => {
    dispatch(getSingleSpot(spotId));
  }, [dispatch, spotId]);
  const {
    id,
    name,
    city,
    state,
    country,
    previewImage,
    description,
    SpotImages,
    Owner,
  } = singleSpot;

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
    </>
  );
}

export default SingleSpot;
