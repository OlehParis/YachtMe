import { useState, useEffect } from 'react';
import './CreateYacht.css';
import { fetchEditNewYacht } from '../../store/yachts';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


const EditYacht = () => {
  const dispatch = useDispatch()
  const {yachtId} = useParams()
  

  const navigate = useNavigate()
  const existingYachtData = useSelector(state => state.yachts[yachtId])

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    name: '',
    price: '',
    description: '',
    lat: '',
    lng: '',
    url: '', preview: true,
    url2: '',
    url3: '',
    url4: '',
    url5: '',
  });


  const hasImageExtension = (str) => {
    return str.includes('png') || str.includes('jpeg') || str.includes('jpg')
  };

  useEffect(() => {
    
    if (existingYachtData) {
     
      setFormData(existingYachtData);
    }
  }, [existingYachtData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  
  };

  const validateForm = () => {
    let newErrors = {};
   console.log(formData, 'formData')
    if (formData.description.length < 30) {
      newErrors.description = "Description must be at least 30 characters long.";
    }
    if(formData.country.length < 1){
      newErrors.country = "Country is required"
    }
    if(formData.address.length < 1){
      newErrors.address = "Address is required"
    }
    if(formData.city.length < 1){
      newErrors.city = "City is required"
    }
    if(formData.state.length < 1){
      newErrors.state = "State is required"
    }
    if(formData.name.length < 1){
      newErrors.name = "Name is required"
    }
    if(formData.price < 1){
      newErrors.price = "Price is required"
    }
    if(formData.url && formData.url.length < 1){
      newErrors.url = "Preview Image is required"
    }
    if(formData.url && !hasImageExtension(formData.url)){
      newErrors.urlFormat = "Preview Image has to be image format"
    }
    if (!(parseFloat(formData.lat) > -90 && parseFloat(formData.lat) < 90)) {
      newErrors.lat = "Latitude must be between -90 and 90"
    }
    if (formData.lat.length <1 ) {
      newErrors.lat2 = "Latitude is required"
    }
    if(!(parseFloat(formData.lng) > -180 && parseFloat(formData.lng) < 180)){
      newErrors.lng = "Longitude must be between -180 and 180"
    }
    if (formData.lng.length <1 ) {
      newErrors.lng2 = "Longitude is required"
    }
    return newErrors;
  };
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFormErrors= validateForm();
    setErrors(newFormErrors);
   
    if (Object.keys(newFormErrors).length === 0) {
      
        const response = await dispatch(fetchEditNewYacht(formData, yachtId));
        navigate(`/yachts/${response.id}`);
    }
  };

  return (
    <div className='createyacht-container'>
    <div className="create-yacht-form">
      <h2>Update your Yacht</h2>
      <h4>Where&apos;s your place located?</h4>
      <p>Guests will only get your exact address once they booked a reservation.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="country">Country</label>
        <input type="text" placeholder='Country' id="country" name="country" value={formData.country} onChange={handleChange} />
        {errors.country && <div className="error">{errors.country}</div>}

        <label htmlFor="address">Street Address</label>
        <input type="text" placeholder='Address' id="address" name="address" value={formData.address} onChange={handleChange} />
        {errors.address && <div className="error">{errors.address}</div>}
        <div className="city-state">
    <div className="input-group" id='state1' style={{width:'100%'}}>
        <label htmlFor="city">City</label>
        <input type="text" style={{width:'100%'}} placeholder='City' id="city" name="city" value={formData.city} onChange={handleChange} />
        {errors.city && <div className="error">{errors.city}</div>}
    </div>

    <div className="input-group" id="state2">
        <label htmlFor="state">State</label>
        <input type="text" placeholder='STATE' id="state" name="state" value={formData.state} onChange={handleChange} />
        {errors.state && <div className="error">{errors.state}</div>}
    </div>
</div>
 <div className="city-state">
  <div className="input-group" id='lon-con' >
        <label htmlFor="Latitude">Latitude</label>
        <input type="text" placeholder='Latitude' id="lat" name="lat" value={formData.lat} onChange={handleChange} />
        {errors.lat && <div className="error">{errors.lat}</div>}
        {errors.lat2 && <div className="error">{errors.lat2}</div>}
        </div>
        <div className="input-group" id = 'lat-con'>
        <label htmlFor="Longitude">Longitude</label>
        <input type="text" placeholder='Longitude' id="lng" name="lng" value={formData.lng} onChange={handleChange} />
        {errors.lng && <div className="error">{errors.lng}</div>}
        {errors.lng2 && <div className="error">{errors.lng2}</div>}
        </div>
        </div>

        <h4>Describe your place to guests</h4>
        <p>Mention the best features of your space, any special amentities like fast wif or parking, and what you love about the neighborhood.</p>
        <label htmlFor="description"></label>
        <textarea id="description"  placeholder="Please write at least 30 characters" name="description" value={formData.description} onChange={handleChange} />
        {errors.description && <div className="error">{errors.description}</div>}
          
         <h4>Create a title for your yacht</h4> 
         <p>Catch guests`&apos; attention with a yacht title that highlights what makes your place special.</p>
        <label htmlFor="title"></label>
        <input type="text" placeholder='Name of your yacht' id="name" name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <div className="error">{errors.name}</div>}

        <label htmlFor="price">Competitive pricing can help your listing stand out and rank higher in search results</label>
        <input type="number" placeholder='Price per night (USD)' id="price" name="price" value={formData.price} onChange={handleChange} />
        {errors.price && <div className="error">{errors.price}</div>}

        <h4>Liven up your yacht with photos</h4> 
        <label htmlFor="url">Submit a link to at least one photo to publish your yacht.</label>
        <input type="text" placeholder='Preview Image URL' id="url" name="url" value={formData.url} onChange={handleChange} />
        {errors.url && <div className="error">{errors.url}</div>}
        {errors.urlFormat && <div className="error">{errors.urlFormat}</div>}

<div className='sub-images'>
    <p></p>
        <input type="text" placeholder="Image URL " id="url2" name="url2" value={formData.url2} onChange={handleChange} />
        <p></p>
        <input type="text" placeholder="Image URL" id="url3" name="url3" value={formData.url3} onChange={handleChange} />
        <p></p>
        <input type="text" placeholder="Image URL" id="url4" name="url4" value={formData.url4} onChange={handleChange} />
        <p></p>
        <input type="text" placeholder="Image URL" id="url5" name="url5" value={formData.url5} onChange={handleChange} />
        <p></p>
        <button  type="submit">Edit Yacht</button>
    </div>    
      </form>
    </div>
    </div>
  );
};

export default EditYacht;
