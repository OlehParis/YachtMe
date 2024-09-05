import { useEffect } from "react";
import { allReviews } from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import UpdateReviewModal from '../ReviewFromModal/UpdateReviewModal'
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';

function ManageReviews() {
    const dispatch = useDispatch();
    const reviewsById = useSelector(state => state.reviews);
    const session = useSelector(state => state.session);
    const curUserId = session.user?.id ?? null;

    useEffect(() => {
        dispatch(allReviews()); 
    }, [dispatch]);

    function formatDate(dateString) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const date = new Date(dateString);
        
        const month = months[date.getMonth()];
        const year = date.getFullYear();
      
        return `${month} ${year}`;
    }

    const userReviews = Object.values(reviewsById).filter(review => review.userId === curUserId);

    return (
      <>
        <h1 id='h1-rev'>Manage Reviews</h1>
        <div className="yff">
          {userReviews.length > 0 ? (
            userReviews.map(review => (
              <div key={review.id}>
                <p style={{ color: 'gray' }}>{formatDate(review.updatedAt.split(" ")[0])}</p>
                <p>{review.review}</p>
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteReviewModal reviewId={review.id} />}
                />
                <OpenModalButton
                  buttonText="Update"
                  modalComponent={<UpdateReviewModal reviewId={review.id} />}
                />
              </div>
            ))
          ) : (
            <div id='h1-bok'>
              <div>You currently don&apos;t have any reviews</div>
            </div>
          )}
        </div>
      </>
    );
}

export default ManageReviews;
