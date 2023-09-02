import { csrfFetch } from "./csrf";

// contants
const GET_ALL_REVIEWS = "reviews/getAllReviews";
const DELETE_REVIEW = "spots/deleteReview";

// regular action creater
export const loadReviews = (reviews) => {
  return {
    type: GET_ALL_REVIEWS,
    reviews,
  };
};
export const removeReview = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId,
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

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeReview(reviewId));
  }
};

// REDUCER

const initialState = {
  spot: {},
  user: {},
};

const reviewsReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case GET_ALL_REVIEWS: {
      const newState = { ...state };
      action.reviews.Reviews.forEach((review) => {
        newState.spot[review.id] = review;
        newState.user[review.id] = review;
      });
      return newState;
    }
    case DELETE_REVIEW: {
      const newState = { ...state };
      const { reviewId } = action;
      delete newState.spot[reviewId];
      delete newState.user[reviewId]
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
