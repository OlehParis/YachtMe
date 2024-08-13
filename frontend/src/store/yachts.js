import { csrfFetch } from "./csrf";

import { loadReviewData } from "./reviews";

export const fetchYachtByID = (yacht) => ({
  type: "FETCH_YACHT_BYID",
  payload: yacht,
});

export const fetchYachtsSuccess = (yachts) => ({
  type: "FETCH_YACHTS_SUCCESS",
  payload: yachts,
});

export const DeleteYacht = (yachtId) => {
  return {
    type: "FETCH_DELETE_YACHT",
    payload: yachtId,
  };
};

export const fetchCreateYacht = (yacht) => ({
  type: "FETCH_CREATE_YACHT",
  payload: yacht,
});
export const fetchEditYacht = (yacht) => ({
  type: "FETCH_EDIT_YACHT",
  payload: yacht,
});

export const fetchDeleteYacht = (yachtId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/yachts/${yachtId}`, {
      method: "DELETE",
    });
    dispatch(DeleteYacht(yachtId));
    return response;
  };
};

export const fetchYachts = () => {
  return async (dispatch) => {
    const response = await fetch("/api/yachts");
    if (!response.ok) {
      throw new Error("Failed to fetch yachts");
    }
    const data = await response.json();
    const page = data.page;
    const size = data.size;
    const allYachtsData = { ...data.Yachts, page, size };

    dispatch(fetchYachtsSuccess(allYachtsData));
  };
};
export const fetchYacht = (yachtId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/yachts/${yachtId}`);
    const res2 = await csrfFetch(`/api/yachts/${yachtId}/reviews`);

    if (!response.ok || !res2.ok) {
      throw new Error("Failed to fetch yachts");
    }
    const yachtDetails = await response.json();
    const reviews = await res2.json();

    // Extract image data
    const yachtImages = yachtDetails[0].YachtImages;

    // Normalize image data
    const normalizedImages = Object.fromEntries(
      yachtImages.map((image) => [image.id, image])
    );

    // Replace yachtDetails.YachtImages with normalized image data
    const normalizedYachtDetails = {
      ...yachtDetails[0],
      YachtImages: normalizedImages,
    };
    console.log(normalizedYachtDetails);
    dispatch(fetchYachtByID(normalizedYachtDetails));
    dispatch(loadReviewData(reviews.Reviews));
  };
};

export const fetchNewYacht = (yacht) => {
  return async (dispatch) => {
    const response = await csrfFetch("/api/yachts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(yacht),
    });
    if (!response.ok) {
      throw new Error("Failed to create yacht");
    }
    const data = await response.json();

    const yachtId = data.id;

    const responseImages = await csrfFetch(`/api/yachts/${yachtId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(yacht),
    });
    const images = await responseImages.json();

    const newYachtDataWithImg = {
      ...data,
      // previewImage: images.url,
      YachtImages: [images],
    };

    dispatch(fetchCreateYacht(newYachtDataWithImg));
    return newYachtDataWithImg;
  };
};

export const fetchEditNewYacht = (yacht, yachtId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/yachts/${yachtId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(yacht),
    });
    if (!response.ok) {
      throw new Error("Failed to create yacht");
    }
    const data = await response.json();

    // const yachtId = data.id;

    const responseImages = await csrfFetch(`/api/yachts/${yachtId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(yacht),
    });
    const images = await responseImages.json();

    const newYachtDataWithImg = {
      ...data,
      previewImage: images.url,
      YachtImages: [images],
    };

    dispatch(fetchEditYacht(newYachtDataWithImg));
    return newYachtDataWithImg;
  };
};

const initialState = {};

const yachtsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_YACHTS_SUCCESS": {
      let nextState = {};
      Object.entries(action.payload).forEach(([key, value]) => {
        if (key !== "page" && key !== "size") {
          nextState[value.id] = value;
        }
      });
      return {
        ...state,
        ...nextState,
      };
    }

    case "FETCH_YACHT_BYID": {
      const yachtId = action.payload.id;

      return {
        ...state,
        // [yachtId]: { ...action.payload }
        [yachtId]: { ...state[yachtId], ...action.payload },
      };
    }
    case "FETCH_CREATE_YACHT": {
      const newYachtId = action.payload.id;
      return {
        ...state,
        [newYachtId]: { ...action.payload },
      };
    }
    case "FETCH_EDIT_YACHT": {
      const editedYachtId = action.payload.id;
      return {
        ...state,
        [editedYachtId]: { ...action.payload },
      };
    }
    case "FETCH_DELETE_YACHT": {
      const yachtIdToDelete = action.payload;
      const newState = { ...state };
      delete newState[yachtIdToDelete];
      return newState;
    }
    default:
      return state;
  }
};

export default yachtsReducer;
