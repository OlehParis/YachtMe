import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchImages } from '../../store/yacht-images';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
const ImageGallery = () => {
    const { spotId } = useParams();
    const spotImages = useSelector(state => state.spots[spotId]);
    const spotsImg = useSelector(state => state.images);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!spotImages || !spotImages.SpotImages || Object.keys(spotImages.SpotImages).length === 0) {
            dispatch(fetchImages(spotId));
        }
    }, [dispatch, spotId, spotImages]);

    const handleClick = (image) => {
        // Perform the desired action on image click
        <OpenModalMenuItem   modalComponent={<DeleteReviewModal  />}></OpenModalMenuItem>
        console.log('Image clicked:', image);
      
    };

    if (!spotImages) {
        return <div>Loading...</div>;
    }

    return (
        <div className="gallery">
            {spotImages.SpotImages && Object.keys(spotImages.SpotImages).length > 0
                ? Object.entries(spotImages.SpotImages).map(([id, image]) => (
                    <img 
                        key={id} 
                        className='gridImg' 
                        src={image.url} 
                        alt={`Image ${parseInt(id) + 1}`} 
                        onClick={() => handleClick(image)}
                    />
                ))
                : Object.entries(spotsImg).map(([id, image]) => (
                    <img 
                        key={id} 
                        className='gridImg' 
                        src={image.url} 
                        alt={`Image ${parseInt(id) + 1}`} 
                        onClick={() => handleClick(image)} // Add click handler
                    />
                ))
            }
        </div>
    );
};

export default ImageGallery;
