// import { useParams } from "react-router-dom";
// constant
const GET_ALL_SPOTS = "/spots/getAllSpots";
const GET_SINGLE_SPOT = "spots/getSingleSpot";
// const { spotId } = useParams();

// action creator
const loadSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};

const loadSingleSpot = (spot) => {
  return {
    type: GET_SINGLE_SPOT,
    spot,
  };
};
// thunk action creator
export const getAllSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");

  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpots(data));
    return data;
  }
};

export const getSingleSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadSingleSpot(data));
    return data;
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
    default:
      return state;
  }
};
export default spotsReducer;
