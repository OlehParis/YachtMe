import { useEffect } from "react";
import { allReviews } from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import UpdateReviewModal from '../ReviewFromModal/UpdateReviewModal'
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';

function ManageReviews() {

    const dispatch = useDispatch();
    const reviewsById = useSelector(state => state.reviews);
    const session = useSelector(state => state.session)
    const curUserId = session.user?.id ?? null;
    useEffect(() => {
        dispatch( allReviews()); 
      }, [dispatch]);

      function formatDate(dateString) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const date = new Date(dateString);
        
        const month = months[date.getMonth()];
        const year = date.getFullYear();
      
        return `${month} ${year}`;
      }

    return (<>
       <h1 id='h1-rev'>Manage Reviews</h1>
       <div className="yff">
                {Object.keys(reviewsById).map(reviewId => {
                    const review = reviewsById[reviewId];
                   
                    if (review.userId === curUserId) {
                    return (
                        <div key={reviewId} >
                            <p style={{ color: 'gray' }}>{formatDate(review.updatedAt.split(" ")[0])} </p>
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
                    );}
                })}
            </div>
       </>
    )
}


export default ManageReviews;
