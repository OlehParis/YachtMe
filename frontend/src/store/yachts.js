import { csrfFetch } from "./csrf";

import { loadReviewData } from "./reviews";

export const fetchSpotByID = (yacht) => ({
  type: "FETCH_YACHT_BYID",
  payload: yacht,
});

export const fetchSpotsSuccess = (yachts) => ({
  type: "FETCH_YACHTS_SUCCESS",
  payload: yachts,
});

export const DeleteSpot = (yachtId) => {
  return {
    type: "FETCH_DELETE_YACHT",
    payload: yachtId,
  };
};

export const fetchCreateSpot = (yacht) => ({
  type: "FETCH_CREATE_YACHT",
  payload: yacht,
});
export const fetchEditSpot = (yacht) => ({
  type: "FETCH_EDIT_YACHT",
  payload: yacht,
});

export const fetchDeleteSpot = (yachtId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/yachts/${yachtId}`, {
      method: "DELETE",
    });
    dispatch(DeleteSpot(yachtId));
    return response;
  };
};

export const fetchSpots = () => {
  return async (dispatch) => {
    const response = await fetch("/api/yachts");
    if (!response.ok) {
      throw new Error("Failed to fetch yachts");
    }
    const data = await response.json();
    const page = data.page;
    const size = data.size;
    const allSpotsData = { ...data.Spots, page, size };

    dispatch(fetchSpotsSuccess(allSpotsData));
  };
};
export const fetchSpot = (yachtId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/yachts/${yachtId}`);
    const res2 = await csrfFetch(`/api/yachts/${yachtId}/reviews`);

    if (!response.ok || !res2.ok) {
      throw new Error("Failed to fetch yachts");
    }
    const yachtDetails = await response.json();
    const reviews = await res2.json();
    
    // Extract image data
    const yachtImages = yachtDetails[0].SpotImages;

    // Normalize image data
    const normalizedImages = Object.fromEntries(
      yachtImages.map(image => [image.id, image])
    );

    // Replace yachtDetails.SpotImages with normalized image data
    const normalizedSpotDetails = {
      ...yachtDetails[0],
      SpotImages: normalizedImages
    };
    console.log(normalizedSpotDetails)
    dispatch(fetchSpotByID(normalizedSpotDetails));
    dispatch(loadReviewData(reviews.Reviews));
  };
};

export const fetchNewSpot = (yacht) => {
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

    const newSpotDataWithImg = {
      ...data,
      previewImage: images.url,
      SpotImages: [images],
    };

    dispatch(fetchCreateSpot(newSpotDataWithImg));
    return newSpotDataWithImg;
  };
};

export const fetchEditNewSpot = (yacht, yachtId) => {
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

    const newSpotDataWithImg = {
      ...data,
      previewImage: images.url,
      SpotImages: [images],
    };

    dispatch(fetchEditSpot(newSpotDataWithImg));
    return newSpotDataWithImg;
  };
};

const initialState = {};

const yachtsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_YACHTS_SUCCESS":{
      let nextState = {};
      Object.entries(action.payload).forEach(([key, value]) => {
        if (key !== "page" && key !== "size") {
          nextState[value.id] = value;
        }
      });
      return {
        ...state,
        ...nextState,
      };}

    case "FETCH_YACHT_BYID":{
      const yachtId = action.payload.id;

      return {
        ...state,
        // [yachtId]: { ...action.payload }
        [yachtId]: { ...state[yachtId], ...action.payload },
      };
}
    case "FETCH_CREATE_YACHT":{
      const newSpotId = action.payload.id;
      return {
        ...state,
        [newSpotId]: { ...action.payload },
      };}
    case "FETCH_EDIT_YACHT":{
      const editedSpotId = action.payload.id;
      return {
        ...state,
        [editedSpotId]: { ...action.payload },
      };}
    case "FETCH_DELETE_YACHT":{
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
