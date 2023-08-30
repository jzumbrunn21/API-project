// constant
const GET_ALL_SPOTS = "spots/getAllSpots";
const GET_SINGLE_SPOT = "spots/getSingleSpot";
const CREATE_NEW_SPOT = "spots/createNewSpot";
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

export const createNewSpot = (spot) => async (dispatch) => {
  const res = await fetch("/api/spots", {
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
    default:
      return state;
  }
};
export default spotsReducer;
