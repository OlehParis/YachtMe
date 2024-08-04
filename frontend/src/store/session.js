import { csrfFetch } from "./csrf";

// Action types
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const UPLOAD_IMAGE_SUCCESS = "session/uploadImageSuccess";

// Action creators
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const uploadImageSuccess = (imageUrl) => ({
  type: UPLOAD_IMAGE_SUCCESS,
  payload: imageUrl,
});

// Thunks
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();

  dispatch(setUser(data.user));
  return response;
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { firstName, lastName, phoneNumber, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

export const updateUser = (user) => async (dispatch) => {
  // Create payload dynamically
  const payload = {};

  if (user.phoneNumber) payload.phoneNumber = user.phoneNumber;
  if (user.email) payload.email = user.email;
  if (user.image) payload.image = user.image;

  try {
    const response = await csrfFetch("/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch(setUser(data.user));
    } else {
      console.error("Failed to update user:", data.errors || data.message);
    }

    return response;
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

// Thunk for uploading the profile image
export const uploadProfileImage = (imageFile) => async (dispatch) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await csrfFetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    dispatch(uploadImageSuccess(data.imageUrl));

    // Optionally, update user with the new image URL
    dispatch(updateUser({ image: data.imageUrl }));
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Initial state
const initialState = {
  user: null,
};

// Reducer
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        user: { ...state.user, image: action.payload },
      };
    default:
      return state;
  }
};

export default sessionReducer;
