import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Spots.css';
import { FaStar } from 'react-icons/fa';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteReviewModal/DeleteYachtModal';

function ManageSpots() {
  
  const navigate = useNavigate();
  const spotsData = useSelector(state => state.spots);
  const session = useSelector(state => state.session);
  const curUserId = session.user?.id ?? null;

  const handleClick = (id) => {
   
    navigate(`/spots/${id}`);

  };

  const handleUpdate = (id) => {

    navigate(`/spots/${id}/edit`);
  };




  const userHasSpots = Object.values(spotsData).some(spot => spot.ownerId === curUserId);

  if (spotsData && userHasSpots) {
    return (
     <div className='spots-container'>
        <h1> Manage Your Spots</h1>
        <div className="spot-card" >
          {Object.values(spotsData).map((spot) => (
            spot.ownerId === curUserId &&
            <div key={spot.id} className="spot">
              <div className="tooltip"  >
                <span className="tooltiptext" >{spot.name} </span>
                <img className='spot-img'  src={spot.previewImage} alt={spot.name} onClick={() => handleClick(spot.id)} />
                <div className='addressAvgRating'>
                  <p>{spot.city}, {spot.state}</p>
                  <p><FaStar color="#ffc107"/> {(spot.avgRating) ? spot.avgRating : 'New'}</p>
                </div>
                <div>${spot.price} night</div>
              
              <div className='buttons'> 
                <button className='hey' onClick={()=> handleUpdate(spot.id)}> Update </button>
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteSpotModal spotId={spot.id} />}
                />
              </div>
              </div>
            </div>
          ))}  
        </div>
        </div>
    
        );
  } else {
    return (
      <div className='spots-container'> 
        <h1> Manage Your Spots</h1>
      
        <button className='hey' onClick={()=> navigate('/spots/new')} >Create New Spot</button>
      </div>
    );
  }
}

export default ManageSpots;
