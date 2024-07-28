import { csrfFetch } from "./csrf";

export const getSpotImages = (yachtId) => ({
  type: "FETCH_IMAGES",
  payload: yachtId,
});

export const fetchImages = (yachtId) => {
  return async (dispatch) => {
    const res = await csrfFetch(`/api/yachts/${yachtId}/images`)
    if (!res.ok) {
      throw new Error("Failed to fetch yachts");
    }
   
    const imagesObj = await res.json();
    console.log(imagesObj)
    return  dispatch(getSpotImages({ id: yachtId, images: imagesObj }));
  }
}

const initialState = {};

const imagesReducer = (state = initialState, action) => {
    switch(action.type) {
      case "FETCH_IMAGES": {
        const {  images } = action.payload;
        const newState = { ...state }
        images.map((img)=> {
            newState[img.id] = img
        })
        return newState
      }
      default:
        return state; // Return the unchanged state for other action types
    }
  }
  
  export default imagesReducer;


 
