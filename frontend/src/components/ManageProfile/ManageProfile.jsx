import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../store/session';
import axios from 'axios'; // Use axios for image upload

function UserProfile() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [email, setEmail] = useState(sessionUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(sessionUser?.phoneNumber || '');
  const [image, setImage] = useState(sessionUser?.image || '');
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState(sessionUser?.title || 'Yacht Owner');
  const [message, setMessage] = useState('');
  const [copyMessage, setCopyMessage] = useState(''); 


  useEffect(() => {
    if (sessionUser) {
      setEmail(sessionUser.email || '');
      setPhoneNumber(sessionUser.phoneNumber || '');
      setImage(sessionUser.image || '');
      setTitle(sessionUser.title || 'Yacht Owner')
    }
  }, [sessionUser]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for email and phone number
    if (!email) {
      setMessage('Email cannot be empty');
      return;
    }

    if (!phoneNumber) {
      setMessage('Phone number cannot be empty');
      return;
    }

    // Upload image if file is selected
    let imageUrl = image;
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // Include credentials if needed
        });

        imageUrl = response.data.imageUrl;
        setImage(imageUrl); 
      } catch (error) {
        console.error('Error uploading image:', error);
        setMessage('Failed to upload image.');
        return;
      }
    }

    const updatedUser = {
      email,
      phoneNumber,
      image: imageUrl,
      title, // Use the uploaded image URL
    };

    try {
      const response = await dispatch(updateUser(updatedUser));

      if (response.ok) {
        setMessage('Profile updated successfully');
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

    // Function to copy the referral code
    const copyReferralCode = async () => {
      try {
        await navigator.clipboard.writeText(sessionUser.referralCode);
        setCopyMessage('Copied!');
        setTimeout(() => setCopyMessage(''), 2000); // Clear message after 2 seconds
      } catch (error) {
        console.error('Failed to copy referral code:', error);
        setCopyMessage('Failed to copy');
      }
    };

  return (
    <div className="user-inf">
      <h2>Update Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
      {image && (
        <div>
          <h3>Profile image:</h3>
          <div className='profile-image-container'>

          <img src={image} alt="Profile"  className='prof-img'  />
          </div>
        </div>
      )}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <select
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          >
            <option value="">Select a title</option>
            <option value="Yacht Owner">Yacht Owner</option>
            <option value="Broker">Broker</option>
          </select>
        </div>
        <div>
          <label htmlFor="imageFile" className="custom-file-upload">Select profile image</label>
          <input
            type="file"
            accept="image/*"
            id="imageFile"
            onChange={handleImageChange}
            style={{ display: 'none' }} 
          />
        </div>
        <div>
        <p ><strong>Referral Code:</strong> <span id='refCode' onClick={copyReferralCode} >{sessionUser.referralCode}</span></p>
        {copyMessage && <p style={{ color: 'green' }}>{copyMessage}</p>}
      </div>
        <p><strong>Credit: </strong> ${sessionUser.credit}</p>
        <button
          className="custom-file-upload"
          type="submit"
          // disabled={sessionUser?.image == null} 
          >
          Update Profile
        </button>
      </form>
     
    </div>
  );
}

export default UserProfile;
