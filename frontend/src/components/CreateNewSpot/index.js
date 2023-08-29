import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createNewSpot } from "../../store/spots";

function CreateNewSpot({ spot }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = {};
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    spot = {
      ...newSpot,
      address,
      city,
      country,
      state,
      name,
      description,
      price,
    };

    const newSpot = await dispatch(createNewSpot(spot));
    spot = newSpot;

    if (spot.errors) {
      setErrors(spot.errors);
    } else {
      history.push(`/spots/${spot.id}`);
    }
  };

  return (
    <>
      <h1>Create a new Spot</h1>
      <h3>Where's your place located?</h3>
      <h5>
        Guests will only get your exact address once they booked a reservation.
      </h5>
      
    </>
  );
}

export default CreateNewSpot;
