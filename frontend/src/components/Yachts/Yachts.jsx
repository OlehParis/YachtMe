
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import './Yachts.css';
import { FaStar } from 'react-icons/fa';
import { fetchYachts } from '../../store/yachts';


function YachtCard() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const yachtsData = useSelector(state => state.yachts);
    const reviews = useSelector(state => state.reviews)

    useEffect(() => {
       dispatch(fetchYachts())
    }, [dispatch, reviews]); 

    const handleClick = (id) => {
        navigate(`/yachts/${id}`); 
      };


   if(yachtsData){
    return (
        <div className="yacht-card" >
        {Object.values(yachtsData).map((yacht) => (
            <div key={yacht.id} className="yacht">
                <div className="tooltip" onClick={() => handleClick(yacht.id)} >
                <span className="tooltiptext">{yacht.name}</span>
                    <img  className='yacht-img'  src={yacht.previewImage} alt={yacht.name} />
                    <div className='addressAvgRating'>
                    <p>{yacht.city}, {yacht.state}</p>
                    <p><FaStar color="#ffc107"/> {yacht.avgRating ? yacht.avgRating.toFixed(1) : 'New'}</p>
                    </div>
                    <div>${yacht.price} night</div>
              
                </div>
            </div>
        ))}  
    </div>
    );
}
}

export default YachtCard;
