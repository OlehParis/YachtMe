import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { fetchDeleteYacht } from '../../store/yachts';
// import { fetchYacht } from '../../store/yachts';
import "./DeleteReviewModal.css"

function DeleteYachtModal( {yachtId} ) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDeleteYacht = () => {
        dispatch(fetchDeleteYacht(yachtId))
        .then(closeModal)
       
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to remove this yacht?</p>
                <div className="modal-buttons">
                <button id='yes' onClick={() => handleDeleteYacht()}>Yes (Delete Yacht)</button>
                    <button id='no' onClick={(closeModal)}>No (Keep Yacht)</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteYachtModal;
