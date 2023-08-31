import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { updateSpot } from "../../store/spots";
import "./UpdateSpot.css";

function UpdateSpot({ spot }) {
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
  const [previewImage, setPreviewImage] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [newSpot, setNewSpot] = useState(null);
  const [url, setUrl] = useState("");

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
      lat,
      lng,
      description,
      price,
      previewImage,
    };
    const updatedSpot = await dispatch(updateSpot(spot));
    setNewSpot(updatedSpot);
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
      setPreviewImage(newSpot.previewImage);
      history.push(`/api/spots/${newSpot.id}`);
    }
  }, [newSpot, history]);

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
      {/* <h3>Liven up your spot with photos</h3>
      <h5>Submit a link to at least one photo to publish your spot.</h5>
      <input
        type="text"
        value={previewImage}
        onChange={(e) => setPreviewImage(e.target.value)}
        placeholder="Preview Image URL"
      />
      <div className="previewImageErrors">{errors.previewImage}</div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL"
      />
      <div className="urlErrors">{errors.url}</div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL"
      />
      <div className="urlErrors">{errors.url}</div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL"
      />
      <div className="urlErrors">{errors.url}</div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL"
      />
      <div className="urlErrors">{errors.url}</div>
      <div className="line-break"></div> */}
      <button type="submit">Submit</button>
    </form>
  );
}

export default UpdateSpot;
