import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

import "./DeleteReviewModal.css"
import { deleteBooking } from '../../store/bookings';

function DeleteReservation({  bookingId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const handleDelete = ( bookingId) => {
       
        dispatch(deleteBooking(bookingId))
        .then(closeModal)
 
      
    };

   

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Confirm Cancelation</h2>
                <p>Are you sure you want to cancle this booking?</p>
                <div className="modal-buttons">
                <button id='yes' onClick={() => handleDelete(bookingId)}>Yes (Cancel Booking)</button>
                    <button id='no' onClick={(closeModal)}>No (Keep Booking)</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteReservation;
