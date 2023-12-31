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

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [errors, setErrors] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    lat,
    lng,
    description: "",
    name: "",
    price: "",
  });
  const [newSpot, setNewSpot] = useState(singleSpot);

  useEffect(() => {
    dispatch(getSingleSpot(spotId));
  }, [dispatch, spotId]);

  const handleSubmit = async (e, spotId) => {
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
    dispatch(updateSpot(spotId, updatedSpot))
      .then((response) => {
        if (response.errors) {
          setErrors(response.errors);
        } else {
          dispatch(getSingleSpot(updatedSpot.id));
          setNewSpot(response);

          history.push(`/spots/${updatedSpot.id}`);
        }
      })
      .catch(async (response) => {
        const data = await response.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(() => {
    if (singleSpot) {
      setCountry(singleSpot.country);
      setAddress(singleSpot.address);
      setCity(singleSpot.city);
      setState(singleSpot.state);
      setDescription(singleSpot.description);
      setLat(singleSpot.lat);
      setLng(singleSpot.lng);
      setName(singleSpot.name);
      setPrice(singleSpot.price);
    }
  }, [singleSpot]);
  // console.log("singleSpot: ", singleSpot);
  const handleDisable =
    !country || !address || !city || !state || !lat || !lng || !price;
  return (
    <div className="create-spot-container">
      <form className="spot-form" onSubmit={(e) => handleSubmit(e, spotId)}>
        <div className="details">
          <h1>Update your spot</h1>
          <h3>Where's your place located?</h3>
          <h5>
            Guests will only get your exact address once they booked a
            reservation.
          </h5>
        </div>
        {/* <div className="creation-errors">









          {errors.previewImage && <p>{errors.previewImage}</p>}
        </div> */}
        <div className="spot-location">
          <div className="address-container">
            <div id="countryErrors">Country</div>
            {errors.country && (
              <p className="creation-errors">{errors.country}</p>
            )}
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
            <div id="addressErrors">Street Address</div>
            {errors.address && (
              <p className="creation-errors">{errors.address}</p>
            )}
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </div>
          <div className="address-details">
            <div className="city-state">
              <div className="cityErrors">City</div>
              {errors.city && <p className="creation-errors">{errors.city}</p>}
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />

              <div className="latErrors">Latitude</div>
              {errors.lat && <p className="creation-errors">{errors.lat}</p>}
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
              />
            </div>
            <div className="lat-lng">
              <div className="stateErrors">State</div>
              {errors.state && (
                <p className="creation-errors">{errors.state}</p>
              )}
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="STATE"
              />
              <div className="lngErrors">Longitude</div>
              {errors.lng && <p className="creation-errors">{errors.lng}</p>}
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
              />
            </div>
          </div>
        </div>
        <div className="line-break"></div>
        <div className="create-description">
          <h3>Describe your place to guests</h3>
          <h5>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </h5>
          {errors.description && (
            <p className="creation-errors">{errors.description}</p>
          )}
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <div id="descriptionErrors"></div>
        </div>
        <div className="line-break"></div>
        <div className="title-container">
          <h3>Create a title for your spot</h3>
          <h5>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </h5>
          {errors.name && <p className="creation-errors">{errors.name}</p>}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your Spot"
          />
        </div>
        <div className="line-break"></div>
        <div className="price-container">
          <h3>Set a base price for your spot</h3>
          <h5>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </h5>
          {errors.price && <p className="creation-errors">{errors.price}</p>}
          <div>
            ${" "}
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per night (USD)"
            />
          </div>
          <div id="priceErrors"></div>
        </div>
        <div className="line-break"></div>
        <button type="submit" disabled={handleDisable}>
          Update Spot
        </button>
      </form>
    </div>
  );
}

export default UpdateSpot;
