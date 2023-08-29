import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import "./SingleSpot.css";

function SingleSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const singleSpot = useSelector((state) => state.spots.singleSpot);
  const { id, name, city, state, country, previewImage, description } =
    singleSpot;

  useEffect(() => {
    dispatch(getSingleSpot(spotId));
  }, [dispatch, spotId]);

  return (
    <>
      <h2>{name}</h2>
      <h4>
        {city}, {state}, {country}
      </h4>
      <img src={previewImage} alt={`Spot ${id}`}></img>
      <h3>Hosted by firstName LastName</h3>
      <p>{description}</p>
    </>
  );
}

export default SingleSpot;
