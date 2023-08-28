import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import "./SpotsList.css";

function SpotsList() {
  const dispatch = useDispatch();
  const spotList = useSelector((state) => Object.values(state.spots));

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <ul>
        {spotList.map(({ id, previewImage, city, state, price, avgRating }) => (
          <li key={id}>
            <img src={previewImage} alt={`Spot ${id}`} />

            <p>
              {city},{state}
            </p>
            <p>${price} night</p>
            <p>{avgRating}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default SpotsList;
