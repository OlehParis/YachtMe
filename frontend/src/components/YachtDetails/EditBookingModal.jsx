import './YachtDetails.css';
import { useState, useEffect } from 'react';
import { useModal } from '../../context/Modal';
import Calendar from 'react-calendar';
import { useSelector, useDispatch } from 'react-redux';
import 'react-calendar/dist/Calendar.css';
import { updateUser } from '../../store/session';
import { fetchUpdateBooking, fetchBookings } from '../../store/bookings';
import { formatToLocalDateTime, formatDate2, convertTo12HourFormat } from '../../../utilities/utils';

function EditBookingModal({  yachtId, existingBooking }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const bookings = useSelector((state) => state.bookings);
  const credit = useSelector(state => state.session.user.credit);
  
  // Parse the existing booking's start and end times
  const existingStartDateTime = new Date(existingBooking.startDateTime);
  const existingEndDateTime = new Date(existingBooking.endDateTime);

 
  // Prepopulate state with existing booking data
  const [checkInDate, setCheckInDate] = useState(existingStartDateTime);
  const [checkOutDate, setCheckOutDate] = useState(existingEndDateTime);
  const [selectedSlot, setSelectedSlot] = useState(convertTo12HourFormat(existingStartDateTime.getHours() + ':00'));
  const [duration, setDuration] = useState(existingBooking.duration);
  const [guests, setGuests] = useState(existingBooking.guests);
  const [isFirstPartVisible, setIsFirstPartVisible] = useState(true);
  const [endTime, setEndTime] = useState(existingEndDateTime);
  const [totalPrice, setTotalPrice] = useState(parseFloat(existingBooking.totalPrice));
    let ee = endTime
    ee
  const timeSlotss = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00',
  ];
  
  useEffect(() => {
    dispatch(fetchBookings(yachtId));
  }, [dispatch, yachtId]);

  const handleToggle = () => {
    if (!checkInDate || !selectedSlot || !duration || !guests ) {
      alert('Please select a valid date, time slot, duration and amount of guests');
      return;
    }

    const [hour, minute] = selectedSlot.split(':').map(Number);
    const startDate = new Date(checkInDate);
    startDate.setHours(hour, minute, 0, 0);

    const calculatedEndDate = new Date(startDate);
    calculatedEndDate.setHours(startDate.getHours() + duration);
    setEndTime(calculatedEndDate);

    const calculatedPrice = priceChecker(duration);
   
    const bookingFee = calculatedPrice * 0.1;
    const tax = (calculatedPrice + bookingFee) * 0.07;

    const total = calculatedPrice + bookingFee + tax;
    setTotalPrice(total);

    setIsFirstPartVisible(false);
  };

  const handleDateChange = (date) => {
    setCheckInDate(date);
    setCheckOutDate(date);
  
  };

  const handleClearDates = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
    setSelectedSlot(null);
  };

  const handleTileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return true;
    }

    for (const bookingKey in bookings) {
      const booking = bookings[bookingKey];
      const newId = booking.yachtId;
      if (Number(yachtId) === Number(newId)) {
        const startDateTime = new Date(booking.startDateTime);
        const endDateTime = new Date(booking.endDateTime);
        if (date >= startDateTime && date <= endDateTime) {
          return true;
        }
      }
    }
    return false;
  };

  const isSlotDisabled = (slot) => {
    if (!checkInDate) return true;
    const now = new Date();
    const [slotHour, slotMinute] = slot.split(':').map(Number);
    const slotDateTime = new Date(checkInDate);
    slotDateTime.setHours(slotHour, slotMinute);

    if (slotDateTime.toDateString() === now.toDateString() && slotDateTime.getTime() <= now.getTime()) {
      return true;
    }

    for (const bookingKey in bookings) {
      const booking = bookings[bookingKey];
      const newId = booking.yachtId;
      if (Number(yachtId) === Number(newId)) {
        const startDateTime = new Date(booking.startDateTime);
        const endDateTime = new Date(booking.endDateTime);

        if (slotDateTime >= startDateTime && slotDateTime <= endDateTime) {
          return true;
        }
      }
    }
    return false;
  };

  const tileClassName = ({ date }) => {
    if (checkInDate && date.getTime() === checkInDate.getTime()) {
      return 'check-in check-out';
    }
    return null;
  };

  const handleGuestChange = (event) => {
    setGuests(parseInt(event.target.value));
    
  };

  const handleDurationChange = (event) => {
    setDuration(parseInt(event.target.value));
 
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const priceChecker = (duration) => {
    if (duration == 4) {
    
      return existingBooking.Yacht.price4;
    }
    if (duration == 6) {
      return existingBooking.Yacht.price6;
    }
    if (duration == 8) {
      return existingBooking.Yacht.price8;
    }
    return 0;
  };

  const handleSubmitBooking = async () => {
    const [hour, minute] = selectedSlot.split(':').map(Number);
    const startDate = new Date(checkInDate);
    startDate.setHours(hour, minute, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + duration);

    const bookingData = {
      bookingId: existingBooking.id, // Use the existing booking ID for update
      yachtId,
      startDateTime: formatToLocalDateTime(startDate.toISOString()),
      endDateTime: formatToLocalDateTime(endDate.toISOString()),
      duration,
      guests,
      totalPrice,
    };

    const updatedCredit = {
      credit: credit - 250,
      email: user.email,
      phoneNumber: user.phoneNumber
    };

    try {
      await dispatch(fetchUpdateBooking(bookingData)); // Use update API
      await dispatch(updateUser(updatedCredit));
      closeModal();
      window.location.href = '/bookings/manage';
      alert('Booking updated successfully!');

    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    }
  };

  const price = priceChecker(duration);
  const bookingFee = price * 0.1;
  const tax = (price + bookingFee) * 0.07;

  return (
    <div className="modal-calendar">
      {isFirstPartVisible ? (
        <div id="firstPart">
          <h3>Select check-in date</h3>
          <Calendar
            onChange={handleDateChange}
            value={checkInDate || checkOutDate}
            tileDisabled={handleTileDisabled}
            tileClassName={tileClassName}
          />
          <div className="time-picker">
            <h4>Select Start Time Slot</h4>
            <div className="time-slots">
              {timeSlotss.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  disabled={isSlotDisabled(slot)}
                  className={selectedSlot === slot ? 'selected-slot' : ''}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <div className="duration-selection">
            <h4>Select Duration</h4>
            <select onChange={handleDurationChange} value={duration}>
              <option value={4}>4 hours</option>
              <option value={6}>6 hours</option>
              <option value={8}>8 hours</option>
            </select>
          </div>
          <div className="guest-selection">
            <h4>Select Number of Guests</h4>
            <select onChange={handleGuestChange} value={guests}>
              {[...Array(100)].map((_, i) => (
                <option
                  key={i + 1}
                  value={i + 1}>
                  {i + 1} Guest{i > 0 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="all-buttons">
            <div>
              <button onClick={handleClearDates}>Clear Date</button>
              <button onClick={handleCloseModal}>Close</button>
              <button onClick={handleToggle}>Continue</button>
            </div>
          </div>
        </div>
      ) : (
        <div id="secondPart">
          <h2>Confirm your booking</h2>
          <div>Name of the yacht: {existingBooking.Yacht.name}</div>
          <div>
            Charter location: {existingBooking.Yacht.address}, {existingBooking.Yacht.city}, {existingBooking.Yacht.state}
          </div>
          <div>Charter Day: {checkInDate && formatDate2(checkInDate)}</div>
          <div>Time: {convertTo12HourFormat(selectedSlot)}</div>
          
          <div>Duration: {duration} hours</div>
          <div>Price {duration} hours: ${price.toFixed(2)}</div>
          <div>Booking fee: ${bookingFee.toFixed(2)}</div>
          <div>Tax: ${tax.toFixed(2)}</div>
          <div>Credit: ${credit} </div>
          <div>Total price: ${totalPrice.toFixed(2) - credit}</div>
          <div className="all-buttons">
            <button onClick={() => setIsFirstPartVisible(true)}>Back</button>
            <button onClick={handleSubmitBooking}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditBookingModal;