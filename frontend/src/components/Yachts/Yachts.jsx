
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import './Yachts.css';
import yacht1 from '/yacht11.svg'
import { fetchYachts } from '../../store/yachts';
import cityImages from '../../cityImages/cities';
import FullScreenVideo from '../Video/FullScreenVideo';

function YachtCard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const yachtsData = useSelector((state) => state.yachts);
    const reviews = useSelector((state) => state.reviews);
    const [showAllYachts, setShowAllYachts] = useState(false);
  
    useEffect(() => {
      dispatch(fetchYachts());
    }, [dispatch, reviews]);
  
    const handleClick = (id) => {
      navigate(`/yachts/${id}`);
    };
    const handleCityClick = (city) => {
      navigate(`/${city}`);
    };
  
    const handleShowAllYachts = () => {
      setShowAllYachts(!showAllYachts);
    };
  
    if (yachtsData) {
      const yachtsToShow = showAllYachts
        ? Object.values(yachtsData)
        : Object.values(yachtsData).slice(0, 8);
  
      const allCities = Object.values(yachtsData).reduce((acc, yacht) => {
        if (!acc.includes(yacht.city)) {
          acc.push(yacht.city);
        }
        return acc;
      }, []);
      
      
      return (
        <>
        <FullScreenVideo />
        <div className='MainScreen'>
          <h2>Featured Cities</h2>
          <div className="city-card">
            {allCities.map((city) => (
              
              <div key={city}
               className="city-container"
               onClick={() => handleCityClick(city)}>
                <img
                  className="city-img"
                  src={cityImages[city] || cityImages.default}
                  alt={city}
                  onError={(e) => (e.target.src = cityImages.default)} // Fallback image
                />
                <div className="city-text">{city}</div>
              </div>
            ))}
          </div>
  
          <h2>Yachts</h2>
          <div className="yacht-card">
            {yachtsToShow.map((yacht) => (
              <div key={yacht.id} >
                <div className="tooltip" onClick={() => handleClick(yacht.id)}>
                  <img
                    className="yacht-img"
                    src={yacht.previewImage}
                    alt={yacht.name}
                  />
                  <div className="avgRating">
                    <h3>
                      {yacht.length}&apos; {yacht.name}
                    </h3>
                    <div className='rank'>
                    <img
                src={ yacht1 }
                alt="Yacht"
                style={{
                  
                  width: '35px', 
                  transition: 'opacity 0.3s',
                 
                }}
              />
                     
                      {yacht.avgRating ? yacht.avgRating.toFixed(1) : 'New'}
                    </div>
                  </div>
                  <div className="price_gray">
                    ${yacht.price4} 4 hours
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="see-all-button-container">
            <button className="see-all-button" onClick={handleShowAllYachts}>
              {showAllYachts ? 'Show Less' : 'See All'}
            </button>
          </div>
          </div>
        </>
      );
    }
  
    return null;
  }
  
  export default YachtCard;
