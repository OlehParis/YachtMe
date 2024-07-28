import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { fetchDeleteSpot } from '../../store/yachts';
// import { fetchSpot } from '../../store/spots';
import "./DeleteReviewModal.css"

function DeleteSpotModal( {spotId} ) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDeleteSpot = () => {
        dispatch(fetchDeleteSpot(spotId))
        .then(closeModal)
       
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to remove this spot?</p>
                <div className="modal-buttons">
                <button id='yes' onClick={() => handleDeleteSpot()}>Yes (Delete Spot)</button>
                    <button id='no' onClick={(closeModal)}>No (Keep Spot)</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteSpotModal;
