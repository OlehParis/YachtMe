import { useEffect, useState} from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { updateUser } from '../../store/session';

function UserProfile() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
  
    const [email, setEmail] = useState(sessionUser?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(sessionUser?.phoneNumber || '');
    const [image, setImage] = useState(sessionUser?.image || '');
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      if (sessionUser) {
        setEmail(sessionUser.email || '');
        setPhoneNumber(sessionUser.phoneNumber || '');
        setImage(sessionUser.image || '');
      }
    }, [sessionUser]);
  
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
  
      const updatedUser = {
        email,
        phoneNumber,
        image,
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
      <div className='user-inf'>
        <h2>Update Profile</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='phoneNumber'>Phone Number:</label>
            <input
              type='text'
              id='phoneNumber'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='image'>Profile Image URL:</label>
            <input
              type='text'
              id='image'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <button type='submit'>Update Profile</button>
        </form>
      </div>
    );
  }
  
  export default UserProfile;
