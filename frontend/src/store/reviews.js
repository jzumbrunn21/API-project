import { csrfFetch } from "./csrf";

// contants
const GET_ALL_REVIEWS = "reviews/getAllReviews";
const DELETE_REVIEW = "reviews/deleteReview";
const CREATE_NEW_REVIEW = "reviews/createReview";

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
export const addNewReview = (review) => {
  return {
    type: CREATE_NEW_REVIEW,
    review,
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

export const createNewReview = (review, spotId) => async (dispatch) => {
  // console.log("sppotId", spotId);
  // console.log("review", review);
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });

  // console.log("response", response);

  if (response.ok) {
    const newReview = await response.json();
    dispatch(addNewReview(newReview));
    return newReview;
  } else if (!response.ok) {
    console.log("POST ERROR");
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

};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REVIEWS: {
      const newState = { ...state };
      action.reviews.Reviews.forEach((review) => {
        newState.spot[review.id] = review;
        // newState.user[review.id] = review;
      });
      return newState;
    }
    case CREATE_NEW_REVIEW: {
      const newState = { ...state };
      const { review } = action;
      newState.spot[review.id] = review;
      // console.log(review);
      // const newState = { ...state, [action.review.id]: action.review };
      return newState;
    }
    case DELETE_REVIEW: {
      const newState = { ...state };
      const { reviewId } = action;
      delete newState.spot[reviewId];
      // delete newState.user[reviewId]
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
