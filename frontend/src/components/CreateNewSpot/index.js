import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createNewSpot } from "../../store/spots";

function CreateNewSpot({ spot }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({});
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
      <div id="countryErrors">Country {errors.country}</div>
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Country"
      />
      <div id="addressErrors">Street Address {errors.address}</div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
      />
      <div id="city-state">
        <div id="cityErrors">City {errors.city}</div>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
        <div id="stateErrors">State {errors.state}</div>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="STATE"
        />
      </div>
      <div className="line-break">
        000000000000000000000000000000000000000000000000000000000000000000
      </div>
      <h3>Describe your place to guests</h3>
      <h5>
        Mention the best features of your space, any special amenities like fast
        wifi or parking, and what you love about the neighborhood.
      </h5>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <div id="descriptionErrors">{errors.description}</div>
      <div className="line-break">
        000000000000000000000000000000000000000000000000000000000000000000
      </div>
      <h3>Create a title for your spot</h3>
      <h5>
        Competitive pricing can help your listing stand out and rank higher in
        search results.
      </h5>
    </>
  );
}

export default CreateNewSpot;
