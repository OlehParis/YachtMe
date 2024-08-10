import './YachtDetails.css';
import { useState, useEffect} from 'react';
import { useModal } from '../../context/Modal';
import Calendar from 'react-calendar';
// import { useNavigate } from 'react-router-dom';
// import TimePicker from 'react-time-picker';
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
    const [selectedSlot, setSelectedSlot] = useState(null);
    // const [ setStartTime] = useState('12:00'); 
    const [duration, setDuration] = useState(4); 
    const [guests, setGuests] = useState(1);
    // const navigate = useNavigate();

    const timeSlots = ['6:00','07:00','08:00','9:00', '10:00', '11:00','12:00','13:00', '14:00', '15:00', '16:00','17:00', '18:00', '19:00', '20:00',];
    console.log(selectedSlot)
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
                if (date >= startDateTime && date <= endDateTime) {
                    return true;
                }
            }
        }
        return false;
    };
    const isSlotDisabled = (slot) => {
        if (!checkInDate) return true;

        const [slotHour, slotMinute] = slot.split(':').map(Number);
        const slotDateTime = new Date(checkInDate);
        slotDateTime.setHours(slotHour, slotMinute);

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
            return 'check-in check-out'; // Combine classes if needed
        }
        return null;
    };
   
    const handleGuestChange = (event) => {
        setGuests(parseInt(event.target.value));
    };
    const handleDurationChange = (event) => {
        setDuration(parseInt(event.target.value));
    };
    //    // Function to calculate and log end time

 
    
    const handleCloseModal = () => {
        
        closeModal();
    };
    function formatToLocalDateTime(isoString) {
        const date = new Date(isoString);
      
        // Extract date components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
      
        // Extract time components
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
      
        // Combine date and time components into the desired format
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }

    const handleSubmitBooking = async () => {
        if (!checkInDate || !selectedSlot) {
            alert('Please select a valid date and time slot.');
            return;
        }

        const [hour, minute] = selectedSlot.split(':').map(Number);
        const startDate = new Date(checkInDate);
        startDate.setHours(hour, minute, 0 , 0);

        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + duration);

        const bookingData = {
            yachtId,
            startDateTime: formatToLocalDateTime(startDate.toISOString()),
            endDateTime: formatToLocalDateTime(endDate.toISOString()),
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
                <h4>Select Start Time Slot</h4>
                <div className="time-slots">
                    {timeSlots.map((slot) => (
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



// const handleCloseModal = () => {
        
//     closeModal();
// };
