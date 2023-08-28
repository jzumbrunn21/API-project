// constant
const GET_ALL_SPOTS = "/spots/getAllSpots";

// action creator
const loadSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
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

// Initial state and reducer
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const newState = {};
      console.log("Action Spots", action.spots);
      action.spots.Spots.forEach((spot) => (newState[spot.id] = spot));
      return newState;
    }
    default:
      return state;
  }
};
export default spotsReducer;
