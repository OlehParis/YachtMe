
import './FullScreenVideo.css';

const FullScreenVideo = () => {
    return (
        <div className="video-container">
            <video
                className="bg-video"
                src="/Luxury.mov"
                type="video/mp4"
                autoPlay
                muted
                loop
                playsInline
            />
        </div>
    );
};

export default FullScreenVideo;
