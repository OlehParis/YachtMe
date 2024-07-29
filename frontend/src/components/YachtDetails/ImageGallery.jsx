import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchImages } from '../../store/yacht-images';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
const ImageGallery = () => {
    const { yachtId } = useParams();
    const yachtImages = useSelector(state => state.yachts[yachtId]);
    const yachtsImg = useSelector(state => state.images);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!yachtImages || !yachtImages.YachtImages || Object.keys(yachtImages.YachtImages).length === 0) {
            dispatch(fetchImages(yachtId));
        }
    }, [dispatch, yachtId, yachtImages]);

    const handleClick = (image) => {
        // Perform the desired action on image click
        <OpenModalMenuItem   modalComponent={<DeleteReviewModal  />}></OpenModalMenuItem>
        console.log('Image clicked:', image);
      
    };

    if (!yachtImages) {
        return <div>Loading...</div>;
    }

    return (
        <div className="gallery">
            {yachtImages.YachtImages && Object.keys(yachtImages.YachtImages).length > 0
                ? Object.entries(yachtImages.YachtImages).map(([id, image]) => (
                    <img 
                        key={id} 
                        className='gridImg' 
                        src={image.url} 
                        alt={`Image ${parseInt(id) + 1}`} 
                        onClick={() => handleClick(image)}
                    />
                ))
                : Object.entries(yachtsImg).map(([id, image]) => (
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
