import './YachtDetails.css';
import { useState, useEffect} from 'react';
import { useModal } from '../../context/Modal';
import Calendar from 'react-calendar';
// import { useNavigate } from 'react-router-dom';
import TimePicker from 'react-time-picker';
import { useSelector, useDispatch} from 'react-redux';
import 'react-calendar/dist/Calendar.css';
import { fetchCreateBooking, fetchBookings } from '../../store/bookings';
// import RequestToBook from './RequestToBook';


function CalendarModal({ onCheckInDateChange, yachtId, onCheckOutDateChange }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.bookings)
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [startTime, setStartTime] = useState('12:00'); 
    const [duration, setDuration] = useState(4); 
    const [guests, setGuests] = useState(1);
    // const navigate = useNavigate();


    useEffect(() => {
        dispatch(fetchBookings(yachtId));
    }, [dispatch, yachtId]);

    const handleDateChange = (date) => {
        setCheckInDate(date);
        setCheckOutDate(date);
        onCheckInDateChange(date);
        onCheckOutDateChange(date);
    };

    const handleClearDates = () => {
        setCheckInDate(null);
        setCheckOutDate(null);
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

                // Check if the current date falls within any existing booking's range
                if (date >= startDateTime && date <= endDateTime) {
                    return true;
                }
            }
        }
        return false;
    };

    const tileClassName = ({ date }) => {
        if (checkInDate && date.getTime() === checkInDate.getTime()) {
            return 'check-in check-out'; // Combine classes if needed
        }
        return null;
    };

    const handleTimeChange = (time) => {
        setStartTime(time);
    };
    const handleGuestChange = (event) => {
        setGuests(parseInt(event.target.value));
    };
    const handleDurationChange = (event) => {
        setDuration(parseInt(event.target.value));
    };
       // Function to calculate and log end time
       const calculateEndTime = () => {
        const [hour, minute] = startTime.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hour, minute);

        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + duration);

        const endHours = endDate.getHours().toString().padStart(2, '0');
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

        console.log('Selected Date:', checkInDate ? checkInDate.toLocaleDateString() : 'None');
        console.log('Selected Time:', startTime);
        console.log('CheckOut Time:', `${endHours}:${endMinutes}`);
        console.log('Selected Duration:', duration + ' hours');
        console.log('Number of Guests:', guests);
    };
    
    const handleCloseModal = () => {
        calculateEndTime();
        closeModal();
    };

    // Function to calculate end time and submit the booking
  const handleSubmitBooking = async () => {
    if (!checkInDate || !startTime) {
      alert('Please select a valid date and start time.');
      return;
    }

    const [hour, minute] = startTime.split(':').map(Number);
    const startDate = new Date(checkInDate);
    startDate.setHours(hour, minute);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + duration);

    const bookingData = {
      yachtId,
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
      duration,
      guests,
      totalPrice: 23, // Replace with actual pricing logic
    };

    console.log('Booking Data:', bookingData);

    try {
      await dispatch(fetchCreateBooking(bookingData));
      console.log('Booking created successfully!');
      closeModal();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

    return (
        <div className="modal-calendar">
            <h3>Select check-in date</h3>
         
            <Calendar
                onChange={handleDateChange}
                value={checkInDate || checkOutDate } 
               tileDisabled={handleTileDisabled}
               tileClassName={tileClassName}
               
            />
            <div className="time-picker">
                <h4>Select Start Time</h4>
                <TimePicker
                    onChange={handleTimeChange}
                    value={startTime}
                    disableClock={true}
                    format='HH:mm'
                />
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
                        <option key={i + 1} value={i + 1}>
                            {i + 1} Guest{ i > 0 ? 's' : '' }
                        </option>
                    ))}
                </select>
            </div>
            <div id='all-buttons'>
                <div> 
                    <button onClick={handleClearDates}>Clear Date</button>
                    <button onClick={handleCloseModal}>Close</button></div>
                    <button onClick={handleSubmitBooking} >Continue</button>
                </div>
        </div>
    );
}

export default CalendarModal;
