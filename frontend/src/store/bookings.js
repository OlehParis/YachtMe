import { csrfFetch } from "./csrf";

// Action Types
const POST_BOOKING = 'POST_BOOKING';
const GET_BOOKINGS = 'GET_BOOKINGS';
const USER_BOOKINGS = 'USER_BOOKINGS';
const DELETE_BOOKING = 'DELETE_BOOKING';
const UPDATE_BOOKING = 'UPDATE_BOOKING';

export const postBooking = (bookings) => ({
  type: POST_BOOKING,
  payload: bookings,
});

export const getBookings = (bookings) => ({
  type: GET_BOOKINGS,
  payload: bookings,
});

export const getUserBookings = (bookings) => ({
  type: USER_BOOKINGS,
  payload:bookings,
});
export const deleteBookingById = (bookingId) => ({
  type: DELETE_BOOKING,
  payload: bookingId,
});

export const updateBooking = (booking) => ({
  type: UPDATE_BOOKING,
  payload: booking,
});

export const deleteBooking = (bookingId) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
      method: "DELETE",
     
    });

    if (response.ok) {
      dispatch(deleteBookingById(bookingId));
    }
  };
};

export const fetchUserBookings = () => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/current`);
    const { Bookings } = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    const normalizedBookings = Bookings.reduce((acc, booking) => {
      acc[booking.id] = booking;
      return acc;
    }, {});
    dispatch(getUserBookings(normalizedBookings));
  };
};

export const fetchBookings = (bookings) => {
  return async (dispatch) => {
    const response = await csrfFetch(`/api/yachts/${bookings}/bookings`);
    const { Bookings } = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    const normalizedBookings = Bookings.reduce((acc, booking) => {
      acc[booking.id] = booking;
      return acc;
    }, {});
    dispatch(getBookings(normalizedBookings));
  };
};

export const fetchCreateBooking = (bookings) => {
  return async (dispatch) => {
    const yachtId = bookings.yachtId;
    const response = await csrfFetch(`/api/yachts/${yachtId}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookings),
    });
    

    const data = await response.json();
   
    dispatch(postBooking(data));
  };
};

export const fetchUpdateBooking = (booking) => { 
  return async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${booking.bookingId}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });

    const data = await response.json();

    dispatch(updateBooking(data));
  };
};

const initialState = {};

const bookingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_BOOKING: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case GET_BOOKINGS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case USER_BOOKINGS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case DELETE_BOOKING: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    case UPDATE_BOOKING: { 
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    default:
      return state;
  }
};

export default bookingsReducer;
