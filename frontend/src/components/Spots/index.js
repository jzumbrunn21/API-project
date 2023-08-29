import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import "./SpotsList.css";

function SpotsList() {
  const dispatch = useDispatch();
  const spotList = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <ul className="spots-list">
        {spotList.map(({ id, previewImage, city, state, price, avgRating }) => (
          <li key={id} className="single-spot">
            <Link to={`/api/spots/${id}`}>
              <img src={previewImage} alt={`Spot ${id}`} />
            </Link>
            <p className="spot-info">
              {city},{state}
            </p>
            <p className="spot-info">${price} night</p>
            <p className="spot-info">{avgRating}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default SpotsList;
