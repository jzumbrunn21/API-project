import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import "./SingleSpot.css";

function SingleSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const singleSpot = useSelector((state) => state.spots.singleSpot);
  const {name, city, state, country, previewImage, description }

  useEffect(() => {
    dispatch(getSingleSpot());
  }, [dispatch, spotId]);

  return (
    <>
    <h2>{}</h2>
    </>
  )
}
