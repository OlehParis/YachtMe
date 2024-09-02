import { useSelector , useDispatch} from 'react-redux';

import {  useEffect } from 'react';
import './Yachts.css';
import { fetchUserBookings } from '../../store/bookings';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import EditBookingModal from '../YachtDetails/EditBookingModal';
import DeleteReservation from '../DeleteReviewModal/DeleteReservation';

function YourBookings() {
    const dispatch = useDispatch();
    const credit = useSelector(state => state.session.user.credit)
   
    useEffect(() => {
        dispatch(fetchUserBookings()); 
    }, [dispatch]);
    
    const bookings = useSelector(state => state.bookings)
 

   
    if (bookings && Object.keys(bookings).length > 0) {
        return (
            <><div id='h1-bok'>
                <h2 >Your Bookings</h2>
                <div className="yacht-card">
                    {Object.values(bookings).map((yacht) => {
                        if (yacht.Yacht) {
                            return (
                                <div key={yacht.id} className="yacht">
                                    <div className="tooltip">
                                    <span className="yacht-name-booking">{yacht.Yacht.name}</span>
                                        <img className="yacht-img" src={yacht.Yacht.previewImage} alt={yacht.Yacht.name} />
                                        <div className="address-price">
                                            <div>{yacht.Yacht.city}, {yacht.Yacht.state}</div>
                                           
                                        </div>
                                        <div className="address-price">
                                            <div>Date and Time: {yacht.startDateTime} </div>
                                            <div>Total: ${yacht.totalPrice - credit}</div>
                                        </div>
                                        <div className="address-price">
                                            <OpenModalButton
                                                buttonText="Change Reservation"
                                                modalComponent={<EditBookingModal yachtData={yacht.Yacht} existingBooking={yacht} yachtId={yacht.Yacht.id} />} 
                                            />
                                            <OpenModalButton
                                                buttonText="Cancel"
                                                modalComponent={<DeleteReservation bookingId={yacht.id} />}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
                </div>
            </>
        );
    } else {
        return (<div id='h1-bok'>
        <div>You currently don&apos;t have any bookings</div>
        </div>
        )
    }
    
}

export default YourBookings;
