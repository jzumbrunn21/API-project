import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateSpot, getSingleSpot } from "../../store/spots";
import "./UpdateSpot.css";
import { useParams } from "react-router-dom";

function UpdateSpot() {
  const dispatch = useDispatch();
  const history = useHistory();
  const singleSpot = useSelector((state) => state.spots.singleSpot);
  const { spotId } = useParams();
  console.log("spotId", spotId);
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState(singleSpot.address);
  const [city, setCity] = useState(singleSpot.city);
  const [state, setState] = useState(singleSpot.state);
  const [country, setCountry] = useState(singleSpot.country);
  const [name, setName] = useState(singleSpot.name);
  const [description, setDescription] = useState(singleSpot.description);
  const [price, setPrice] = useState(singleSpot.price);
  const [lat, setLat] = useState(singleSpot.lat);
  const [lng, setLng] = useState(singleSpot.lng);
  const [newSpot, setNewSpot] = useState(singleSpot);

  useEffect(() => {
    dispatch(getSingleSpot(spotId));
  }, [dispatch, spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const updatedSpot = {
      id: spotId,
      address,
      city,
      country,
      state,
      name,
      lat,
      lng,
      description,
      price,
    };

    const editedSpot = await dispatch(updateSpot(updatedSpot));
    dispatch(getSingleSpot(spotId));
    setNewSpot(editedSpot);
    history.push(`/api/spots/${editedSpot.id}`);
  };

  useEffect(() => {
    if (newSpot && !newSpot.errors) {
      setCountry(newSpot.country);
      setAddress(newSpot.address);
      setCity(newSpot.city);
      setState(newSpot.state);
      setDescription(newSpot.description);
      setLat(newSpot.lat);
      setLng(newSpot.lng);
      setName(newSpot.name);
      setPrice(newSpot.price);
    }
  }, [newSpot]);

  return (
    <form id="spot-form" onSubmit={handleSubmit}>
      <h1>Update Your Spot</h1>
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
      <div id="lat-lng">
        <div id="lat-Errors">Latitude {errors.lat}</div>
        <input
          type="text"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Latitude"
        />
        <div id="lng-Errors">Longitude {errors.lng}</div>
        <input
          type="text"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Longitude"
        />
      </div>
      <div className="line-break"></div>
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
      <div className="line-break"></div>
      <h3>Create a title for your spot</h3>
      <h5>
        Catch guests' attention with a spot title that highlights what makes
        your place special.
      </h5>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name of your Spot"
      />
      <div className="line-break"></div>
      <h3>Set a base price for your spot</h3>
      <h5>
        Competitive pricing can help your listing stand out and rank higher in
        search results.
      </h5>
      <div>
        ${" "}
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price per night (USD)"
        />
      </div>
      <div id="priceErrors">{errors.price}</div>
      <div className="line-break"></div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default UpdateSpot;
