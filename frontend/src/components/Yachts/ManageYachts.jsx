import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Yachts.css';
import { FaStar } from 'react-icons/fa';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteYachtModal from '../DeleteReviewModal/DeleteYachtModal';

function ManageYachts() {
  
  const navigate = useNavigate();
  const yachtsData = useSelector(state => state.yachts);
  const session = useSelector(state => state.session);
  const curUserId = session.user?.id ?? null;

  const handleClick = (id) => {
   
    navigate(`/yachts/${id}`);

  };

  const handleUpdate = (id) => {

    navigate(`/yachts/${id}/edit`);
  };




  const userHasYachts = Object.values(yachtsData).some(yacht => yacht.ownerId === curUserId);

  if (yachtsData && userHasYachts) {
    return (
     <div className='yachts-container'>
        <h1> Manage Your Yachts</h1>
        <div className="yacht-card" >
          {Object.values(yachtsData).map((yacht) => (
            yacht.ownerId === curUserId &&
            <div key={yacht.id} className="yacht">
              <div className="tooltip"  >
                <span className="tooltiptext" >{yacht.name} </span>
                <img className='yacht-img'  src={yacht.previewImage} alt={yacht.name} onClick={() => handleClick(yacht.id)} />
                <div className='addressAvgRating'>
                  <p>{yacht.city}, {yacht.state}</p>
                  <p><FaStar color="#ffc107"/> {(yacht.avgRating) ? yacht.avgRating : 'New'}</p>
                </div>
                <div>${yacht.price} night</div>
              
              <div className='buttons'> 
                <button className='hey' onClick={()=> handleUpdate(yacht.id)}> Update </button>
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteYachtModal yachtId={yacht.id} />}
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
      <div className='yachts-container'> 
        <h1> Manage Your Yachts</h1>
      
        <button className='hey' onClick={()=> navigate('/yachts/new')} >Create New Yacht</button>
      </div>
    );
  }
}

export default ManageYachts;
