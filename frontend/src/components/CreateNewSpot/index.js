import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNewImage, createNewSpot } from "../../store/spots";
import { useEffect } from "react";
import "./CreateNewSpot.css";

function CreateNewSpot({ spot }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [newSpot, setNewSpot] = useState(null);
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [url3, setUrl3] = useState("");
  const [url4, setUrl4] = useState("");
  const createdSpot = useSelector((state) => state.spots.singleSpot);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    spot = {
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
    try {
      const createdSpot = await dispatch(createNewSpot(spot));
      if (createdSpot.id) {
        const spotId = createdSpot.id;
        const imageUrls = [previewImage, url1, url2, url3, url4].filter(
          Boolean
        );
        console.log(("imageUrls ", imageUrls));
        for (const imageUrl of imageUrls) {
          await dispatch(addNewImage({ url: imageUrl, preview: true }, spotId));
        }
        // setNewSpot(createdSpot);
        history.push(`/api/spots/${spotId}`);
      } else {
        console.log("CREATION BUG");
      }
    } catch (error) {
      console.log("SPOT CREATION ERROR");
    }
  };

  useEffect(() => {
    if (newSpot && !newSpot.errors) {
      setCountry(newSpot.country);
      setAddress(newSpot.address);
      setCity(newSpot.city);
      setState(newSpot.state);
      setDescription(newSpot.description);
      setName(newSpot.name);
      setLat(newSpot.lat);
      setLng(newSpot.lng);
      setPrice(newSpot.price);
      setPreviewImage(newSpot.previewImage);
      setUrl1(newSpot.url1);
      setUrl2(newSpot.url2);
      setUrl3(newSpot.url3);
      setUrl4(newSpot.url4);
    }
  }, [newSpot]);

  return (
    <form id="spot-form" onSubmit={handleSubmit}>
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
      <h3>Liven up your spot with photos</h3>
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
        value={url1}
        onChange={(e) => setUrl1(e.target.value)}
        placeholder="Image URL"
      />
      <div className="urlErrors">{errors.url}</div>
      <input
        type="text"
        value={url2}
        onChange={(e) => setUrl2(e.target.value)}
        placeholder="Image URL"
      />
      <div className="urlErrors">{errors.url}</div>
      <input
        type="text"
        value={url3}
        onChange={(e) => setUrl3(e.target.value)}
        placeholder="Image URL"
      />
      <div className="urlErrors">{errors.url}</div>
      <input
        type="text"
        value={url4}
        onChange={(e) => setUrl4(e.target.value)}
        placeholder="Image URL"
      />
      <div className="urlErrors">{errors.url}</div>
      <div className="line-break"></div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateNewSpot;
