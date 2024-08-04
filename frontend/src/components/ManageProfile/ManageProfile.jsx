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
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (sessionUser) {
      setEmail(sessionUser.email || '');
      setPhoneNumber(sessionUser.phoneNumber || '');
      setImage(sessionUser.image || '');
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
        setImage(imageUrl); // Update local state with new image URL
      } catch (error) {
        console.error('Error uploading image:', error);
        setMessage('Failed to upload image.');
        return;
      }
    }

    const updatedUser = {
      email,
      phoneNumber,
      image: imageUrl, // Use the uploaded image URL
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

  return (
    <div className="user-inf">
      <h2>Update Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="imageFile">Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            id="imageFile"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      {image && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={image} alt="Profile" style={{ width: '200px', height: '200px' }} />
        </div>
      )}
    </div>
  );
}

export default UserProfile;
