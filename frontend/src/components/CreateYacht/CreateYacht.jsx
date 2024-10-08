import { useState, useEffect } from 'react';
import './CreateYacht.css';
import { fetchNewYacht } from '../../store/yachts';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';

const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.google === 'object' && window.google.maps) {
      resolve(); // Google Maps API is already loaded
    } else {
      const existingScript = document.getElementById('googleMaps');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}&libraries=places&language=en`;
        script.id = 'googleMaps';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      } else {
        resolve(); // Script is already loaded
      }
    }
  });
};

const CreateYacht = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [placeSelected, setPlaceSelected] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    name: '',
    price4: '',
    price6: '',
    price8: '',
    description: '',
    lat: '',
    lng: '',
    builder: '',
    year: '',
    bathrooms: '',
    cabins: '',
    length: '',
    guests: '',
    speed: '',
    previewUrl: '',
  });

  useEffect(() => {
    loadGoogleMapsAPI().then(() => {
      console.log("Google Maps API loaded.");
    }).catch((error) => {
      console.error('Error loading Google Maps API:', error);
    });
  }, []);

  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setErrors((prevErrors) => ({ ...prevErrors, previewUrl: "Image file is required" }));
      return;
    }

    const imageData = new FormData();
    imageData.append('image', imageFile);

    try {
      const response = await axios.post('/api/upload', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData((prevData) => ({ ...prevData, previewUrl: response.data.imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors((prevErrors) => ({ ...prevErrors, previewUrl: "Failed to upload image" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = useGoogle({
    debounce: 200,
    language: 'en',
    apiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
  });

  const handlePlaceSelected = (place) => {
    const { formatted_address, address_components, geometry } = place;
    if (!geometry || !formatted_address) {
      console.error('Place details are missing.');
      return;
    }

    const { lat, lng } = geometry.location;

    let city = '';
    let state = '';
    let country = '';

    address_components.forEach((component) => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      if (component.types.includes('country')) {
        country = component.long_name;
      }
    });

    setFormData((prevData) => ({
      ...prevData,
      address: formatted_address.split(',')[0],
      city: city,
      state: state,
      country: country,
      lat: lat(),
      lng: lng(),
    }));
    document.getElementById('address').value = formatted_address.split(',')[0];
    setPlaceSelected(true);
  };

  const validateForm = () => {
    const newErrors = {};
   
    if (formData.description.length < 30) newErrors.description = "Description must be at least 30 characters long.";
    if (formData.country.length < 1) newErrors.country = "Country is required.";
    if (formData.address.length < 1) newErrors.address = "Address is required.";
    if (formData.city.length < 1) newErrors.city = "City is required.";
    if (formData.state.length < 1) newErrors.state = "State is required.";
    if (formData.name.length < 1) newErrors.name = "Name is required.";
    if (formData.price4 < 1 || formData.price6 < 1 || formData.price8 < 1) newErrors.price = "Prices for all durations are required.";
    if (formData.previewUrl.length < 1) newErrors.previewUrl = "Preview Image is required.";
    if (formData.builder.length < 1) newErrors.builder = "Builder is required.";
    if (!formData.year || isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear()) {
      newErrors.year = "Please enter a valid year.";
    }
    if (formData.bathrooms < 0 || !formData.bathrooms || isNaN(formData.bathrooms)) {newErrors.bathrooms = "Please enter a valid number of bathrooms."; }
    if (formData.cabins < 0 || !formData.cabins || isNaN(formData.cabins)) { newErrors.cabins = "Please enter a valid number of cabins.";}
    if (!formData.length || isNaN(formData.length) || formData.length < 1) {newErrors.length = "Please enter a valid length.";}
    if (!formData.guests || isNaN(formData.guests) || formData.guests < 1) {newErrors.guests = "Please enter a valid number of guests.";}
    if (!formData.speed || isNaN(formData.speed) || formData.speed < 1) {newErrors.speed = "Please enter a valid speed.";}
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      dispatch(fetchNewYacht(formData)).then((response) => {
        navigate(`/yachts/${response.id}`);
      });
    }
  };

  

  return (
    <div className="createyacht-container">
      <div className="create-yacht-form">
        <h2>List your Yacht</h2>

        <h4>Where&apos;s your yacht located?</h4>

        <form onSubmit={handleSubmit}>
          <div className="eag-mb-20">
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Address"
              onChange={(e) => {
                getPlacePredictions({
                  input: e.target.value,
                });
              }}
            />
            {!isPlacePredictionsLoading &&
              placePredictions?.map((item) => (
                <div
                  key={item.place_id}
                  onClick={() => {
                    placesService?.getDetails(
                      { placeId: item.place_id },
                      (placeDetails) => handlePlaceSelected(placeDetails)
                    );
                  }}
                >
                  {!placeSelected && item.description}
                </div>
              ))}
          </div>
          {errors.address && <div className="error">{errors.address}</div>}

          <input
            type="text"
            placeholder="Country"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
          {errors.country && <div className="error">{errors.country}</div>}

          <div className="city-state">
            <div className="input-group" style={{ width: '100%' }}>
              <input
                type="text"
                style={{ width: '100%' }}
                placeholder="City"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && <div className="error">{errors.city}</div>}
            </div>

            <div className="input-group">
             
              <input
                type="text"
                placeholder="State"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              {errors.state && <div className="error">{errors.state}</div>}
            </div>
          </div>

          <h4>Describe your yacht</h4>
          <p>Mention the best features of your yacht</p>
          <label htmlFor="description"></label>
          <textarea
            id="description"
            placeholder="Please write at least 30 characters"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <div className="error">{errors.description}</div>}

          <div>
            <h4>Yacht Name</h4>
            <input
              type="text"
              placeholder="Name of your yacht"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>
          <h4>Prices</h4>
          <label htmlFor="price4">
            Competitive pricing can help your listing stand out and rank higher in search results
          </label>
          <input
            type="number"
            placeholder="Price for 4 hours"
            id="price4"
            name="price4"
            value={formData.price4}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Price for 6 hours"
            id="price6"
            name="price6"
            value={formData.price6}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Price for 8 hours"
            id="price8"
            name="price8"
            value={formData.price8}
            onChange={handleChange}
          />
          {errors.price && <div className="error">{errors.price}</div>}

          <h4>Additional info</h4>
 <div className='additional-info'>
          <div>
          
            <input
              type="text"
              placeholder="Builder"
              id="builder"
              name="builder"
              value={formData.builder}
              onChange={handleChange}
            />
            {errors.builder && <div className="error">{errors.builder}</div>}

          </div>
          <div>
          
            <input
              type="text"
              placeholder="Year"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
            {errors.year && <div className="error">{errors.year}</div>}

          </div>
          <div>
           
            <input
              type="text"
              placeholder="Bathrooms"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
            />
            {errors.bathrooms && <div className="error">{errors.bathrooms}</div>}

          </div>
          <div>
          
            <input
              type="text"
              placeholder="Cabins"
              id="cabins"
              name="cabins"
              value={formData.cabins}
              onChange={handleChange}
              min="0"
            />
            {errors.cabins && <div className="error">{errors.cabins}</div>}

          </div>
          <div>
           
            <input
              type="text"
              placeholder="Length"
              id="length"
              name="length"
              value={formData.length}
              onChange={handleChange}
            />
            {errors.length && <div className="error">{errors.length}</div>}

          </div>
          <div>
         
            <input
              type="text"
              placeholder="Guests"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
            />
            {errors.guests && <div className="error">{errors.guests}</div>}

          </div>
          <div>
           
            <input
              type="text"
              placeholder="Speed"
              id="speed"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
            />
            {errors.speed && <div className="error">{errors.speed}</div>}

          </div>
          </div>
          <h4>Liven up your yacht with photos</h4>
          <input type="file" onChange={handleFileChange} />
          <button type="button" onClick={handleImageUpload}>
            Upload Image
          </button>
          {errors.previewUrl && <div className="error">{errors.previewUrl}</div>}
          <div className="sub-images">
            <p></p>
            <div className='all-buttons'>
              <button type="submit">Create Yacht</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateYacht;
