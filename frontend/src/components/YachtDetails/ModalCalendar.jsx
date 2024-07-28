import './SpotDetails.css';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import Calendar from 'react-calendar';
import { useSelector} from 'react-redux';
import 'react-calendar/dist/Calendar.css';


function CalendarModal({ onCheckInDateChange, spotId, onCheckOutDateChange }) {
    const { closeModal } = useModal();
    const bookings = useSelector(state => state.bookings)
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
  
    const handleDateChange = (date) => {
        if (!checkInDate) {
            setCheckInDate(date);
            onCheckInDateChange(date);
        } else {
            // If check-in date is after check-out date, swap them
            if (checkInDate > date) {
                setCheckOutDate(checkInDate);
                setCheckInDate(date);
                onCheckOutDateChange(checkInDate);
                onCheckInDateChange(date);
            } else {
                setCheckOutDate(date);
                onCheckOutDateChange(date);
            }
            closeModal();
        }
    };

    const handleClearDates = () => {
        setCheckInDate(null);
        setCheckOutDate(null);
    };

    const handleTileDisabled = ({ date }) => {
        const bookingKeys = Object.keys(bookings);
        const dateString = date.toISOString().split('T')[0]; // Convert date to string in 'YYYY-MM-DD' format
        for (const bookingKey of bookingKeys) {
            const booking = bookings[bookingKey];
            const newId = booking.spotId;
            if (Number(spotId) === Number(newId)) {
                const startDate = booking.startDate.split(' ')[0]; 
                const endDate = booking.endDate.split(' ')[0]; 
                if (dateString >= startDate && dateString <= endDate) {
                    return true;
                }
            }
        }
        return false; // Enable the date
    };

    const tileClassName = ({ date }) => {
        if (checkInDate && date.getTime() === checkInDate.getTime()) {
            return 'check-in';
        } else if (checkOutDate && date.getTime() === checkOutDate.getTime()) {
            return 'check-out';
        } else if (checkInDate && checkOutDate && date > checkInDate && date < checkOutDate) {
            return 'selected-range';
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
            <button onClick={handleClearDates}>Clear Dates</button>
            <button onClick={closeModal}>Close</button>
        </div>
    );
}

export default CalendarModal;
