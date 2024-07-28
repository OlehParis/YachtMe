import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';
import "./DeleteReviewModal.css"

function DeleteReviewModal({ reviewId, yachtId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const handleDelete = (reviewId, yachtId) => {
       
        dispatch(deleteReview(reviewId,yachtId))
        .then(closeModal)
 
      
    };

   

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this review?</p>
                <div className="modal-buttons">
                <button id='yes' onClick={() => handleDelete(reviewId, yachtId)}>Yes (Delete Review)</button>
                    <button id='no' onClick={(closeModal)}>No (Keep Review)</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteReviewModal;
