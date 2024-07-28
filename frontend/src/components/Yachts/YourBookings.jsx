import { useSelector , useDispatch} from 'react-redux';
// import { useNavigate } from 'react-router-dom'
import {  useEffect } from 'react';
import './Spots.css';
import { fetchUserBookings } from '../../store/bookings';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import ModalCalendar from '../YachtDetails/ModalCalendar'
import DeleteReservation from '../DeleteReviewModal/DeleteReservation';

function YourBookings() {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const spotsData = useSelector(state => state.spots);
    useEffect(() => {
        dispatch(fetchUserBookings()); 
    }, [dispatch]);
    
    const spotsData = useSelector(state => state.bookings)

    
    // const handleClick = (id) => {
    //     navigate(`/spots/${id}`); 
    //   };
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' }); // Get abbreviated month name
        const formattedDate = `${day} ${month}`;
        return formattedDate;
    }
 
   
    if (spotsData && Object.keys(spotsData).length > 0) {
        return (
            <>
                <h1>Your Bookings</h1>
                <div className="spot-card">
                    {Object.values(spotsData).map((spot) => {
                        if (spot.Spot) {
                            return (
                                <div key={spot.id} className="spot">
                                    <div className="tooltip">
                                        <span className="tooltiptext">{spot.Spot.name}</span>
                                        <img className="spot-img" src={spot.Spot.previewImage} alt={spot.Spot.name} />
                                        <div className="address-price">
                                            <div>{spot.Spot.city}, {spot.Spot.state}</div>
                                            <div>${spot.Spot.price} per night</div>
                                        </div>
                                        <div className="address-price">
                                            <div>Dates: {formatDate(spot.startDate)} - {formatDate(spot.endDate)}</div>
                                            <div>Total: ${spot.totalPrice}</div>
                                        </div>
                                        <div className="address-price">
                                            <OpenModalButton
                                                buttonText="Change Reservation"
                                                modalComponent={<ModalCalendar />}
                                            />
                                            <OpenModalButton
                                                buttonText="Cancel"
                                                modalComponent={<DeleteReservation bookingId={spot.id} />}
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
            </>
        );
    } else {
        return <h2>You currently don&apos;t have any bookings</h2>;
    }
}

export default YourBookings;
