// MapComponent.js
import { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { loadScript } from '../../../utilities/utils';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const MapComponent = ({ lat, lng }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  const center = { lat: latitude, lng: longitude };

  const apiK = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

  useEffect(() => {
    if (!window.google) {
      loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiK}`)
        .then(() => setMapLoaded(true))
        .catch(() => setError('Failed to load Google Maps API'));
    } else {
      setMapLoaded(true);
    }
  }, [apiK]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!mapLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default MapComponent;
