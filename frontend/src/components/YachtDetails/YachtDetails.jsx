import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchYacht } from '../../store/yachts';
import './YachtDetails.css';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ReviewFromModal from '../ReviewFromModal/ReviewFromModal'
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import PriceModal from './PriceModal';
import CalendarModal from './ModalCalendar';

import yacht1 from '/yacht11.svg'
import yacht2 from '/yacht2.svg' 
import { calculateStarsAndReviews, formatDate } from '../../../utilities/utils';

import MapComponent from './Map';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';


function YachtDetails() {
    const { yachtId } = useParams();
    const dispatch = useDispatch()
    const yachtData = useSelector(state => state.yachts[yachtId]);
   
    // test
    const session = useSelector(state => state.session)
    const notLogIn = session.user === null;
    const reviews = useSelector(state => state.reviews)
    // const bookings = useSelector(state => state.bookings)
    const [beError, setBeError] = useState(null);
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const navigate = useNavigate();

 
    console.log(beError,checkIn, checkOut)
  const handleShowAllPhotos = () => {
        navigate('./gallery');
    };
    const sortedReviews = Object.keys(reviews).map(reviewId => {
      return reviews[reviewId];
  });
  function StarRating({ stars }) { 
    const totalStars = 5;
  
    const filledStars = Array.from({ length: stars }, (_, index) => (
     
      <img 
      width= '30px'
      key={index}
      src={yacht1}
      />
    ));
  
    const emptyStars = Array.from({ length: totalStars - stars }, (_, index) => (
      <img 
      width= '30px'
      key={index}
      src={yacht2}
      />
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
        dispatch(fetchYacht(yachtId));
      }, [dispatch, yachtId]);

      

      if (!yachtData ) {
        return <div>Loading...</div>;
    }


    const curUserId = session.user?.id ?? null;
    const yachtOwnerId = yachtData.ownerId
    let reviewMatchCurUserId = false;
      for (let reviewId in reviews) {
    const review = reviews[reviewId];
       if ( Number(review.yachtId) === Number(yachtId) && review.userId === curUserId ) {
        reviewMatchCurUserId = true;
        break; 
       }
      }  

    const dontShowButton = reviewMatchCurUserId || curUserId === yachtOwnerId;
    const onwerOfYacht = curUserId === yachtOwnerId;
    
    const { avgStars, reviewCount } = calculateStarsAndReviews(reviews, yachtId);
    const yachtImageObj = yachtData?.YachtImages;
    const previewImage = yachtImageObj ? Object.values(yachtImageObj).find(image => image.preview)?.url || '' : '';
    const userImageNull = session.user?.image == null
    return ( 
      <>
      <div className='video-container'>
      {previewImage && <img src={previewImage} alt="Preview" className="bg-photo" />}
        <div className='yacht-main-info'>
          <div id='yacht-name-length'>{yachtData.length}&apos; {yachtData.name}</div>
          <div>{yachtData.address}, {yachtData.city}, {yachtData.state}, {yachtData.country}</div>
         <hr></hr>
         <div className='profile-yacht'> 
            <div className='profile-image-container'>
              <img src={yachtData.Owner?.image} alt="Profile"  className='prof-img'  />
            </div >

            <div id='name-title'>
              <h3>  {yachtData.Owner?.firstName} {yachtData.Owner?.lastName}</h3>
              <p>  {yachtData.Owner?.title || 'Yacht Broker'} </p>
              </div>
           </div>
          <div className='container-inner'> {!notLogIn && !onwerOfYacht &&  < div className='bookingContainer'> 
                    <OpenModalMenuItem
                    itemText={`From $${yachtData.price4} for 4 hours`}
                    modalComponent={<PriceModal yachtData={yachtData}/>}
                    
                    />
                    </div>}
                  
                    {!notLogIn && !onwerOfYacht &&  < div className='bookingContainer'> 
                   <OpenModalButton 
                        onButtonClick={() => {setBeError(null)}}
                        buttonText={'Reserve'}
                        modalComponent={<CalendarModal 
                        onCheckInDateChange={setCheckIn}
                        yachtId={yachtId}
                        yachtData={yachtData}
                        onCheckOutDateChange={setCheckOut} />}
                    />
                    
                    </div>}
               </div>
        
        </div>
     
      </div>
        <div className="yacht-details">
        <h1>Images</h1>
        
          
        <div className="image-gallery">
                    {yachtData.YachtImages && Object.entries(yachtData.YachtImages).filter(([, image]) => image.preview === false).slice(0, 4).map(([, image], index) => (
                        <div key={index} className={`image-container ${index === 3 ? 'blurred' : ''}`} onClick={index === 3 ? handleShowAllPhotos : null}>
                            <img className='gridImg' src={image.url} alt={`Image ${index + 1}`} />
                            {index === 3 && (
                                <span className='imagesButton' >{Object.keys(yachtImageObj).length}+</span>
                            )}
                        </div>
                    ))}
                </div>
      {/* <div className="details"> */}
            <h1>Specifications</h1>
            <div className='info'>
            <div className='specs'>
              <div className='np-1'>
                    <p className='pp'>Builder</p>
                    <p>{yachtData.builder}</p>
              </div>
              <div className='np-2'>
                    <p className='pp'>Guests</p>
                    <p>{yachtData.guests}</p>
              </div>
              <div className='np-3'>
                    <p className='pp'>Cabins</p>
                    <p>{yachtData.cabins}</p>
              </div>
              <div className='np-4'>
                    <p className='pp'>Bathrooms</p>
                    <p>{yachtData.bathrooms}</p>
              </div>
              <div className='np-5'>
                    <p className='pp'>Speed</p>
                    <p>{yachtData.speed}</p>
              </div>
              <div className='np-6'>
                    <p className='pp'>Year</p>
                    <p>{yachtData.year}</p>
              </div>
              

            {/* </div> */}
            </div>
       
        </div>
        <h1>Reviews</h1>
        <h3 className='rating2'>
        <img 
       style={{width: '33px', }}
      src={yacht1}
      />
  
  {Number(avgStars) ? ` ${avgStars}` : ' New'}  
  {reviewCount !== 0 && ( reviewCount ? ` · ${reviewCount}` : ' · 0' ) }
  {reviewCount !== 0 && (reviewCount === 1 ? ' Review' : ' Reviews')}
                                       
        </h3> 
        <div id='postReviewButton'>
        {!reviewMatchCurUserId && curUserId !== yachtOwnerId && !notLogIn && !userImageNull &&(
          <OpenModalButton
            buttonText="Write Review" 
            modalComponent={<ReviewFromModal yachtId={yachtId}   />}
          />
        )}
        </div>
        <div className='reviews'>
{reviewCount !==0 && sortedR.map(review => {
    if (Number(review.yachtId) === Number(yachtId)) {
        return (
        // <div className='all-reviews'>
            <div key={review.id} className='wow'>
              <div id='tt4'> 
              <div className='review-image-container'>
              <img src={review.User?.image || session.user?.image} alt="Profile"  className='prof-img'  />
              
              </div>
              {review.userId === curUserId && (
                    <OpenModalButton
                    
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal reviewId={review.id} />}
                    />
                )}
                </div>
              <div className='review-name'>
                <h3>{review.User?.firstName || session.user.firstName} {review.User?.lastName || session.user.lastName}</h3>
                <p className='date-review1' style={{  color: 'gray' }}>{formatDate(review.updatedAt.split(" ")[0])}</p>
                <StarRating stars={review.stars} />
                <p>{review.review}</p>
               
                </div>
                </div>
            // </div>
        );
    } else {
        return null;
    }
})}
        
        </div>
        {reviewCount == 0 && !notLogIn && !dontShowButton &&  <h2>Be the first to post a review! </h2> }

        <div id="map" className="yacht-map"></div>
        <MapComponent lat={yachtData.lat} lng ={yachtData.lng}></MapComponent>
    </div>
    </>
);

}

export default YachtDetails;
