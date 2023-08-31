import { csrfFetch } from "./csrf";

// constant
const GET_ALL_SPOTS = "spots/getAllSpots";
const GET_SINGLE_SPOT = "spots/getSingleSpot";
const CREATE_NEW_SPOT = "spots/createNewSpot";
const DELETE_SPOT = "spots/deleteSpot";
const UPDATE_SPOT = "spots/updateSpot";
const IMPORT_IMAGE = "spots/addNewImage";
// const { spotId } = useParams();

// action creator
export const loadSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};

export const loadSingleSpot = (spot) => {
  return {
    type: GET_SINGLE_SPOT,
    spot,
  };
};

export const addNewSpot = (spot) => {
  return {
    type: CREATE_NEW_SPOT,
    spot,
  };
};
export const removeSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};
export const editSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot,
  };
};

export const uploadImage = (image) => {
  return {
    type: IMPORT_IMAGE,
    image,
  };
};
export const addNewImage = (image, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( image),
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(addNewSpot(newSpot));
    return newSpot;
  } else {
    const errors = await response.json();
    return errors;
  }
};
// thunk action creator
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpots(data));
    return data;
  }
};

export const getSingleSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadSingleSpot(data));
    return data;
  }
};

export const createNewSpot = (spot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const newSpot = await res.json();
    dispatch(addNewSpot(newSpot));
    return newSpot;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deletedSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeSpot(spotId));
  }
};

export const updateSpot = (spotId, spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });
  // console.log(spotId);
  if (response.ok) {
    const newSpot = await response.json();
    dispatch(editSpot(spot));
    return newSpot;
  } else {
    const errors = await response.json();
    return errors;
  }
};
// Initial state and reducer

const initialState = {
  allSpots: {},
  singleSpot: {},
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const newState = { ...state };
      action.spots.Spots.forEach((spot) => (newState.allSpots[spot.id] = spot));
      return newState;
    }
    case GET_SINGLE_SPOT: {
      const newState = { ...state, singleSpot: action.spot };
      // newState.singleSpot = action.spot;
      return newState;
    }
    case CREATE_NEW_SPOT: {
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
      };
    }
    case UPDATE_SPOT: {
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
      };
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState.allSpots[action.spotId];
      return newState;
    }
    case IMPORT_IMAGE: {
      const { spotId, image } = action;
      const updatedSpot = { ...state.allSpots[spotId] };

      if (!updateSpot.images) {
        updatedSpot.images = [];
      }
      updateSpot.images.push(image);

      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [spotId]: updatedSpot,
        },
      };
    }
    default:
      return state;
  }
};
export default spotsReducer;
