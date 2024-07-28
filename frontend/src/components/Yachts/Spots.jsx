
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import './Spots.css';
import { FaStar } from 'react-icons/fa';
import { fetchSpots } from '../../store/yachts';


function SpotCard() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const spotsData = useSelector(state => state.spots);
    const reviews = useSelector(state => state.reviews)

    useEffect(() => {
       dispatch(fetchSpots())
    }, [dispatch, reviews]); 

    const handleClick = (id) => {
        navigate(`/spots/${id}`); 
      };


   if(spotsData){
    return (
        <div className="spot-card" >
        {Object.values(spotsData).map((spot) => (
            <div key={spot.id} className="spot">
                <div className="tooltip" onClick={() => handleClick(spot.id)} >
                <span className="tooltiptext">{spot.name}</span>
                    <img  className='spot-img'  src={spot.previewImage} alt={spot.name} />
                    <div className='addressAvgRating'>
                    <p>{spot.city}, {spot.state}</p>
                    <p><FaStar color="#ffc107"/> {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}</p>
                    </div>
                    <div>${spot.price} night</div>
              
                </div>
            </div>
        ))}  
    </div>
    );
}
}

export default SpotCard;
