import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Yachts.css';
import yacht1 from '/yacht11.svg'

import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteYachtModal from '../DeleteReviewModal/DeleteYachtModal';
import { fetchUserYachts } from '../../store/yachts';

function ManageYachts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const yachtsData = useSelector(state => state.yachts);
  const session = useSelector(state => state.session);
  const sessionUser = useSelector(state => state.session.user);
  const curUserId = session.user?.id ?? null;

  useEffect(() => {
   
    if (curUserId) {
      dispatch(fetchUserYachts());
    }
  }, [dispatch, curUserId]);

  const handleClick = (id) => {
    navigate(`/yachts/${id}`);
  };

  const handleUpdate = (id) => {
    
    navigate(`/yachts/${id}/edit`);
  };

  // Ensure we get the yachts that belong to the current user
  const userYachts = Object.values(yachtsData).filter(yacht => yacht.ownerId === curUserId);

  if (userYachts.length > 0) {
    return (
      <div className='yachts-container'> 
      <div className="yacht-card">
      {userYachts.map((yacht) => (
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
            <div className='buttons'> 
        <button className='hey' onClick={() => handleUpdate(yacht.id)}>Update</button>
          <OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteYachtModal yachtId={yacht.id} />}
        />
</div>
        </div>
      ))}
    </div>
    </div>
    );
  } else {
    return (
      <div className='yachts-container'> 
        <h1>Manage Your Yachts</h1>
        <p id='p2p'>You currently don&apos;t have any yachts listed.</p>
        {sessionUser.image ? (<button className='hey' onClick={() => navigate('/yachts/new')}>Create New Yacht</button>
        ):(
          <button className='hey' onClick={() => navigate('/users/profile')}>Create New Yacht</button>)}
      </div>
    );
  }
}

export default ManageYachts;
