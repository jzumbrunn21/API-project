import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";

function SpotsList() {
  const dispatch = useDispatch();
  const spotList = useSelector((state) => Object.values(state.spots));

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <ul>
        {spotList?.map(({ id, previewImage }) => (
          <li key={id}>
            <img src={previewImage} alt={`Spot ${id}`} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default SpotsList;
