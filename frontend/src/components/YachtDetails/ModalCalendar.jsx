import './YachtDetails.css';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import Calendar from 'react-calendar';
import { useSelector} from 'react-redux';
import 'react-calendar/dist/Calendar.css';


function CalendarModal({ onCheckInDateChange, yachtId, onCheckOutDateChange }) {
    const { closeModal } = useModal();
    const bookings = useSelector(state => state.bookings)
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
  
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
        const today = new Date()
        today.setHours(0 , 0 , 0 , 0)
        const bookingKeys = Object.keys(bookings);
        if (date < today) {
            return true;
        }
        const dateString = date.toISOString().split('T')[0]; // Convert date to string in 'YYYY-MM-DD' format
        for (const bookingKey of bookingKeys) {
            const booking = bookings[bookingKey];
            const newId = booking.yachtId;
            if (Number(yachtId) === Number(newId)) {
                const startDate = booking.startDate.split(' ')[0]; 
                const endDate = booking.endDate.split(' ')[0]; 
                if (dateString >= startDate && dateString <= endDate ) {
                    return true;
                }
            }
        }
        return false; // Enable the date
    };

    const tileClassName = ({ date }) => {
        if (checkInDate && date.getTime() === checkInDate.getTime()) {
            return 'check-in check-out'; // Combine classes if needed
        }
        return null;
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
            <button onClick={handleClearDates}>Clear Date</button>
            <button onClick={closeModal}>Close</button>
        </div>
    );
}

export default CalendarModal;
