import { useState, useEffect } from 'react';
import './CreateYacht.css';
import { fetchEditNewYacht } from '../../store/yachts';
import { fetchYacht } from '../../store/yachts';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';

const EditYacht = () => {
  const dispatch = useDispatch();
  const { yachtId } = useParams();
  
  const navigate = useNavigate();
  const existingYachtData = useSelector(state => state.yachts[yachtId]);
  const yachtImages = existingYachtData?.YachtImages ?? {}; 
  const imageId = Object.entries(yachtImages).find(
    ([, value]) => value.preview === true
  )?.[0]; 
  

  const [placeSelected, setPlaceSelected] = useState(false);
  const [errors, setErrors] = useState({});
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


  const [imageFile, setImageFile] = useState(null); // For image upload


  useEffect(() => {
    dispatch(fetchYacht(yachtId));
  }, [dispatch, yachtId]);
  
  useEffect(() => {
    if (existingYachtData) {
      setFormData({
        ...existingYachtData,
        previewUrl: existingYachtData.previewImage || '',
      });
    }
  }, [existingYachtData]);

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
    console.log(formData, 'form data');
    if (formData.description.length < 30) newErrors.description = "Description must be at least 30 characters long.";
    if (formData.country.length < 1) newErrors.country = "Country is required.";
    if (formData.address.length < 1) newErrors.address = "Address is required.";
    if (formData.city.length < 1) newErrors.city = "City is required.";
    if (formData.state.length < 1) newErrors.state = "State is required.";
    if (formData.name.length < 1) newErrors.name = "Name is required.";
    if (formData.price4 < 1 || formData.price6 < 1 || formData.price8 < 1) newErrors.price = "Prices for all durations are required.";
    // if (formData.previewUrl.length < 1) newErrors.previewUrl = "Preview Image is required.";

    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
       await dispatch(fetchEditNewYacht(formData, yachtId, imageId));
      
      navigate(`/yachts/${yachtId}`);
    }
  };

  return (
    <div className="createyacht-container">
      <div className="create-yacht-form">
        <h2>Edit Your Yacht</h2>

        <h4>Where&apos;s your yacht located?</h4>

        <form onSubmit={handleSubmit}>
          <div className="eag-mb-20">
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => {
                getPlacePredictions({
                  input: e.target.value,
                });
                handleChange(e);
              }}
            />
            {!isPlacePredictionsLoading &&
              placePredictions.map((item) => (
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
              <label htmlFor="state">State</label>
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

          <div>
            <label htmlFor="builder">Builder</label>
            <input
              type="text"
              placeholder="Builder"
              id="builder"
              name="builder"
              value={formData.builder}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="year">Year</label>
            <input
              type="text"
              placeholder="Year"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              type="text"
              placeholder="Bathrooms"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="cabins">Cabins</label>
            <input
              type="text"
              placeholder="Cabins"
              id="cabins"
              name="cabins"
              value={formData.cabins}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="length">Length</label>
            <input
              type="text"
              placeholder="Length"
              id="length"
              name="length"
              value={formData.length}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="guests">Amount of Guests</label>
            <input
              type="text"
              placeholder="Guests"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="speed">Speed</label>
            <input
              type="text"
              placeholder="Speed"
              id="speed"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
            />
          </div>
          <h4>Liven up your yacht with photos</h4>
          <input type="file" onChange={handleFileChange} />
          <button type="button" onClick={handleImageUpload}>
            Upload Image
          </button>
          {errors.previewUrl && <div className="error">{errors.previewUrl}</div>}
          <div className="sub-images">
            <p></p>
            <div className="all-buttons">
              <button type="submit">Edit Yacht</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditYacht;
