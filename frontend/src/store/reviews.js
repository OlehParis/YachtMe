import { csrfFetch } from "./csrf";
// import { fetchYachtByID } from "./yachts";

export const loadReviewData = (reviewsArr) => ({
  type: "LOAD_REVIEW_DATA",
  payload: reviewsArr,
});

export const fetchCreateRaviewById = (review) => ({
  type: "FETCH_CREATE_REVIEW_BYID",
  payload: review,
});

export const UpdateReviewById = (review) => ({
  type: "UPDATE_REVIEW_BYID",
  payload: review,
});

export const fetchDeleteReview = (reviewId) => ({
  type: "FETCH_DELETE_REVIEW",
  payload: reviewId,
});

export const fetchAllReviews = (reviews) => ({
  type: "FETCH_ALL_REVIEWS",
  payload: reviews,
});

export const allReviews = () => {
  return async (dispatch) => {
    const response = await csrfFetch("/api/reviews/current");
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    const data = await response.json();
    const normalizedData = {};
    data.Reviews.forEach((review) => {
      normalizedData[review.id] = review;
    });

    
    dispatch(fetchAllReviews(normalizedData));
  };
};

export const deleteReview = (reviewId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      dispatch(fetchDeleteReview(reviewId));
    }
  };
};

export const fetchYachtReview = (yacht) => {
  return async (dispatch) => {
    const yachtId = yacht.yachtId;
    const response = await csrfFetch(`/api/yachts/${yachtId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(yacht),
    });
    if (!response.ok) {
      throw new Error("Failed to create review");
    }
    const data = await response.json();

    dispatch(fetchCreateRaviewById(data));
  };
};

export const fetchUpdateYachtReview = (review) => {
  return async (dispatch) => {
    
    const { reviewId } = review;
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });
    if (!response.ok) {
      throw new Error("Failed to update review");
    }
    const data = await response.json();
    dispatch(UpdateReviewById(data));
  };
};

const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CREATE_REVIEW_BYID": {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case "UPDATE_REVIEW_BYID": {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case "FETCH_DELETE_REVIEW": {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    case "LOAD_REVIEW_DATA": {
      const newState = { ...state };
      action.payload.map((rev) => {
        newState[rev.id] = rev;
      });
      return newState;
    }

    case "FETCH_ALL_REVIEWS": {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default reviewReducer;
