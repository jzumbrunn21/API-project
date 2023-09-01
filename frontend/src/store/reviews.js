import { csrfFetch } from "./csrf";

// contants
const GET_ALL_REVIEWS = "reviews/getAllReviews";

// regular action creater
export const loadReviews = (reviews) => {
  return {
    type: GET_ALL_REVIEWS,
    reviews,
  };
};

// Thunks
export const getAllReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadReviews(data));
    return data;
  }
};

// REDUCER

const initialState = {
  spot: {},
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REVIEWS: {
      const newState = { ...state };
      action.reviews.Reviews.forEach(
        (review) => (newState.spot[review.id] = review)
      );
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
