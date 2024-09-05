import { useState } from 'react';
import { useDispatch, } from 'react-redux';
import { fetchYachtReview } from '../../store/reviews';
import yacht1 from '/yacht11.svg'
import yacht2 from '/yacht2.svg'
import { useModal } from '../../context/Modal';
import './ReviewFromModal.css';


function StarRating({ defaultRating, onChange }) {
  const totalStars = 5;
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(defaultRating);

  const handleHover = (value) => {
    setHoverRating(value);
  };

  const handleClick = (value) => {
    setSelectedRating(value === selectedRating ? 0 : value);
    setHoverRating(0);
    onChange(value === selectedRating ? 0 : value);
  };

  return (
    <div className='stars-container'>
      <div className='stars2'>
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={index}
              onMouseEnter={() => handleHover(starValue)}
              onMouseLeave={() => handleHover(0)}
              onClick={() => handleClick(starValue)}
            >
              <img
                src={starValue <= (hoverRating || selectedRating) ? yacht1 : yacht2}
                alt="Yacht"
                style={{
                  
                  width: '48px', 
                  transition: 'opacity 0.3s',
                  opacity: starValue <= (hoverRating || selectedRating) ? 1 : 0.5,
                }}
              />
            </span>
          );
        })}
      </div>
      
    </div>
  );
}

function ReviewFromModal({ yachtId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleRatingChange = (value) => {
    setStars(value);
  };

  const handleSubmit = () => {
    const Reviews = {
      yachtId,
      review,
      stars
    };
    dispatch(fetchYachtReview(Reviews))
      .then(() => {
        closeModal();
      });
  
  };

  let buttonCheck = stars === 0 || review.length < 10;
  
  return (
    <div className="modal-calendar">
      <h2>How was this yacht?</h2>
      <div className='error-val'>{buttonCheck && <p className='rev-valid'> review should be minimum 20 characters 
        </p>}</div>
      <textarea
      id='text-rev1'
        placeholder="Leave your review here..."
        value={review}
        onChange={handleReviewChange}
      ></textarea>
      <StarRating defaultRating={stars} className='stars2' onChange={handleRatingChange} />
     <div className='ooo'>
      <button id='rev-but' onClick={handleSubmit} disabled={buttonCheck }>
        Submit Your Review
      </button>
      </div>
    </div>
  );
}

export default ReviewFromModal;
