import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchYachts } from '../../store/yachts';
import { useNavigate } from 'react-router-dom'; 
import yacht1 from '/yacht11.svg'

function CityYachts() {
    const { city } = useParams();
    
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filteredYachts, setFilteredYachts] = useState([]);
  const yachts = useSelector((state) => state.yachts);

  useEffect(() => {
    if (!Object.keys(yachts).length) {
      dispatch(fetchYachts());
    }
  }, [dispatch, yachts]);

  useEffect(() => {
    if (city && Object.keys(yachts).length > 0) {
      const yachtsInCity = [];


      for (const [, yacht] of Object.entries(yachts)) {
        if (yacht.city && yacht.city.toLowerCase() == city.toLowerCase()) {
          yachtsInCity.push(yacht);
        }
      }

      setFilteredYachts(yachtsInCity);
    }
  }, [city, yachts]);

  const handleClick = (id) => {
    navigate(`/yachts/${id}`);
  };



  if (!filteredYachts.length) {
    return <p>No yachts available in {city}.</p>;
  }

  return (
    <div className="yacht-list">
      <h2>Yachts in {city}</h2>
      <div className="yacht-card">
        {filteredYachts.map((yacht) => (
          <div key={yacht.id} onClick={() => handleClick(yacht.id)} className="tooltip">
            <img className="yacht-img" 
            src={yacht.previewImage} 
            alt={yacht.name} />
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
                ${yacht.price4} 4 hours</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CityYachts;
