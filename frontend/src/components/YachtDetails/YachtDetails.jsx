import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchSpot } from '../../store/yachts';
import './SpotDetails.css';
import { FaStar, FaRegStar } from 'react-icons/fa';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ReviewFromModal from '../ReviewFromModal/ReviewFromModal'
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import CalendarModal from './ModalCalendar';
import { fetchBookings } from '../../store/bookings';
import { calculateStarsAndReviews, formatDate } from '../../../utilities/utils';

import MapComponent from './Map';


function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch()
    const spotData = useSelector(state => state.spots[spotId]);
    const session = useSelector(state => state.session)
    const reviews = useSelector(state => state.reviews)
    const bookings = useSelector(state => state.bookings)
    const [beError, setBeError] = useState(null);
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const navigate = useNavigate();

    const handleReserveClick = () => {
        navigate('./booking',  { state: {checkIn, checkOut } });
};
  const handleShowAllPhotos = () => {
        navigate('./gallery');
    };
    const sortedReviews = Object.keys(reviews).map(reviewId => {
      return reviews[reviewId];
  });
  function StarRating({ stars }) { 
    const totalStars = 5;
  
    const filledStars = Array.from({ length: stars }, (_, index) => (
      <FaStar key={index} color="#ffc107" />
    ));
  
    const emptyStars = Array.from({ length: totalStars - stars }, (_, index) => (
      <FaRegStar key={index} color="#e4e5e9" />
    ));
    return (
      <div>
        {filledStars}
        {emptyStars}
      </div>
    );
  }
  const sortedR = sortedReviews.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));


    useEffect(() => {
        dispatch(fetchSpot(spotId));
      }, [dispatch, spotId]);

      useEffect(() => {
        async function fetchBookingsData() {
          try {
            await dispatch(fetchBookings(spotId));
            // setLoadingBookings(false);
          } catch (error) {
            console.error('Error fetching bookings:', error);
          }
        }
        fetchBookingsData();
      }, [dispatch, spotId]);

      const isReservationDisabled = () => {
        if (!checkIn || !checkOut) return true; // If check-in or check-out dates are not selected, disable reservation
        const bookingKeys = Object.keys(bookings);
       { for (const bookingKey of bookingKeys) {
            const booking = bookings[bookingKey];
            const newId = booking.spotId;
            if (Number(spotId) === Number(newId)) {
              const startDate = booking.startDate;
              const endDate = booking.endDate;
              if(checkIn && checkOut){
              const newCheckIn = checkIn.toISOString().split('T')[0];
              const newCheckOut = checkOut.toISOString().split('T')[0];

                if ((newCheckIn <= startDate ) && ( newCheckOut >= endDate)) {
                    return true; // Disable reservation if selected dates are within the blocked range
                }}
            }
        }}
        return false; // Enable reservation if selected dates are not within the blocked range
    };

      if (!spotData ) {
        return <div>Loading...</div>;
    }


    const curUserId = session.user?.id ?? null;
    const spotOwnerId = spotData.ownerId
    let reviewMatchCurUserId = false;
      for (let reviewId in reviews) {
    const review = reviews[reviewId];
       if ( Number(review.spotId) === Number(spotId) && review.userId === curUserId ) {
        reviewMatchCurUserId = true;
        break; 
       }
      }  

    const dontShowButton = reviewMatchCurUserId || curUserId === spotOwnerId;
    const onwerOfSpot = curUserId === spotOwnerId;
    const notLogIn = session.user === null;
    const { avgStars, reviewCount } = calculateStarsAndReviews(reviews, spotId);
     
    return ( 
      
        <div className="spot-details">
    
     
        <h2>{spotData.name}</h2>
        <p>{spotData.address}, {spotData.state},  {spotData.country}</p>
        <div className='images'>
          {spotData.SpotImages && Object.values(spotData.SpotImages).map(spot => (
            spot.preview ? <img key={spot.id} className='mainImage' src={spot.url} alt={`Spot ${spot.id}`} /> : null
              ))}
          <div className="image-gallery">
    {spotData.SpotImages && Object.entries(spotData.SpotImages).filter(([, image]) => image.preview === false).slice(0, 4).map(([, image], index) => (
        <img key={index} className='gridImg' src={image.url} alt={`Image ${index + 1}`} />
    ))}
</div>
            <button className='imagesButton' onClick={handleShowAllPhotos} >Show all photos</button>
        </div>
      <div className="details">
            <div className='info'>
            {spotData.Owner && (<h2> Hosted by {spotData.Owner.firstName} {spotData.Owner.lastName}</h2>)}
            <p>{spotData.description}</p>
            </div>
            <div className='container-price'>
                <div className='container-inner'>
                  
                    <div className='container'>
                    <div className='price'><h3>${spotData.price}</h3> <p>night</p></div>
                    <p className='rating'><FaStar color="#ffc107"/> 
                    {Number(avgStars) ? ` ${avgStars}` : ' New'}   
                    {reviewCount !== 0 && ( reviewCount ? ` · ${reviewCount}` : ' · 0' ) }
                    {reviewCount !== 0 && (reviewCount === 1 ? ' Review' : ' Reviews')}</p>
                    </div>
              
                 {!notLogIn && !onwerOfSpot &&  < div className='bookingContainer'> 
                    <div>check-in<OpenModalButton 
                   onButtonClick={() => {setBeError(null)}}
                        buttonText={    <input
                          type="text"
                          placeholder={checkIn ? checkIn.toLocaleDateString() : new Date().toLocaleDateString()}
                          readOnly/>}
                        modalComponent={<CalendarModal 
                        onCheckInDateChange={setCheckIn}
                        spotId={spotId}
                        onCheckOutDateChange={setCheckOut} />}
                    />
                    </div>
                    <div>check-out<OpenModalButton 
                        buttonText={    <input
                          type="text"
                          placeholder={checkOut ? checkOut.toLocaleDateString() : 'Add date'}
                          readOnly/>}
                        modalComponent={<CalendarModal
                        beError={beError}  
                        onCheckInDateChange={setCheckIn}
                        onCheckOutDateChange={setCheckOut} />}
                    />
                    
                    </div>
                    </div>}
                  
             {!notLogIn && !onwerOfSpot && <button 
               onClick={handleReserveClick}
               disabled={isReservationDisabled()}>Reserve</button> }
                </div>
           </div>
        </div>
        <div className='reviews'>
        <h3 className='rating2'>
  <FaStar color="#ffc107"/> 
  
  {Number(avgStars) ? ` ${avgStars}` : ' New'}  
  {reviewCount !== 0 && ( reviewCount ? ` · ${reviewCount}` : ' · 0' ) }
  {reviewCount !== 0 && (reviewCount === 1 ? ' Review' : ' Reviews')}
                                       
        </h3> 
        <div id='postReviewButton'>
        {!reviewMatchCurUserId && curUserId !== spotOwnerId && !notLogIn && (
          <OpenModalButton
            buttonText="Post Your Review" 
            modalComponent={<ReviewFromModal spotId={spotId}   />}
          />
        )}
        </div>
{reviewCount !==0 && sortedR.map(review => {
    if (Number(review.spotId) === Number(spotId)) {
        return (
            <div key={review.id} className='wow'>
                <h3>{review.User?.firstName || session.user.firstName}</h3>
                <p style={{ color: 'gray' }}>{formatDate(review.updatedAt.split(" ")[0])}</p>
                <StarRating stars={review.stars} />
                <p>{review.review}</p>
                {review.userId === curUserId && (
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal reviewId={review.id} />}
                    />
                )}
            </div>
        );
    } else {
        return null;
    }
})}
        
        {reviewCount == 0 && !notLogIn && !dontShowButton &&  <h2>Be the first to post a review! </h2> }
        </div>

        <div id="map" className="spot-map"></div>
        <MapComponent lat={spotData.lat} lng ={spotData.lng}></MapComponent>
    </div>
);

}

export default SpotDetails;
