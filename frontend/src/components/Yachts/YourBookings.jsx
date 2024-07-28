import { useSelector , useDispatch} from 'react-redux';
// import { useNavigate } from 'react-router-dom'
import {  useEffect } from 'react';
import './Yachts.css';
import { fetchUserBookings } from '../../store/bookings';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import ModalCalendar from '../YachtDetails/ModalCalendar'
import DeleteReservation from '../DeleteReviewModal/DeleteReservation';

function YourBookings() {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const yachtsData = useSelector(state => state.yachts);
    useEffect(() => {
        dispatch(fetchUserBookings()); 
    }, [dispatch]);
    
    const yachtsData = useSelector(state => state.bookings)

    
    // const handleClick = (id) => {
    //     navigate(`/yachts/${id}`); 
    //   };
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' }); // Get abbreviated month name
        const formattedDate = `${day} ${month}`;
        return formattedDate;
    }
 
   
    if (yachtsData && Object.keys(yachtsData).length > 0) {
        return (
            <>
                <h1>Your Bookings</h1>
                <div className="yacht-card">
                    {Object.values(yachtsData).map((yacht) => {
                        if (yacht.Yacht) {
                            return (
                                <div key={yacht.id} className="yacht">
                                    <div className="tooltip">
                                        <span className="tooltiptext">{yacht.Yacht.name}</span>
                                        <img className="yacht-img" src={yacht.Yacht.previewImage} alt={yacht.Yacht.name} />
                                        <div className="address-price">
                                            <div>{yacht.Yacht.city}, {yacht.Yacht.state}</div>
                                            <div>${yacht.Yacht.price} per night</div>
                                        </div>
                                        <div className="address-price">
                                            <div>Dates: {formatDate(yacht.startDate)} - {formatDate(yacht.endDate)}</div>
                                            <div>Total: ${yacht.totalPrice}</div>
                                        </div>
                                        <div className="address-price">
                                            <OpenModalButton
                                                buttonText="Change Reservation"
                                                modalComponent={<ModalCalendar />}
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
            </>
        );
    } else {
        return <h2>You currently don&apos;t have any bookings</h2>;
    }
}

export default YourBookings;
