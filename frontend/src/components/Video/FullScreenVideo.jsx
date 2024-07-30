import  { useEffect } from 'react';
import './FullScreenVideo.css';

const FullScreenVideo = () => {
    useEffect(() => {
        // Load the IFrame Player API code asynchronously.
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // This function creates an <iframe> (and YouTube player)
        // after the API code downloads.
        window.onYouTubeIframeAPIReady = () => {
            new window.YT.Player('player', {
                videoId: 'wsAETIlTVXg',
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    loop: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    playlist: 'wsAETIlTVXg'
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange
                }
            });
        };
    }, []);

    const onPlayerReady = (event) => {
        event.target.seekTo(3);
        event.target.playVideo();
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            const player = event.target;
            const durationLimit = 50; 
            const checkPlayback = setInterval(() => {
                if (player.getCurrentTime() >= durationLimit) {
                    player.seekTo(3); 
                }
            }, 1000);

            // Clear the interval when the video is paused or ended
            player.addEventListener('onStateChange', (stateChangeEvent) => {
                if (stateChangeEvent.data !== window.YT.PlayerState.PLAYING) {
                    clearInterval(checkPlayback);
                }
            });
        }
    };

    return (
        <div className="video-container">
            <div id="player" className="bg-video"></div>
        </div>
    );
};

export default FullScreenVideo;
