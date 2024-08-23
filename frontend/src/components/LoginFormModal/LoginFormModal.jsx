import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors before making a new request
    try {
      // Attempt to log in
      await dispatch(sessionActions.login({ credential, password }));
      closeModal(); // Close modal if login is successful
    } catch (error) {
      if(error.status === 401)
      setErrors({ invalidCredentials: 'The provided credentials were invalid' });
      // setPassword('');
    }
  };


  const isSubmitDisabled = credential.length < 4 || password.length < 6;

  const handleDemoUserLogin = async () => {
    setErrors({});
    try {
     
      await dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }));
      closeModal();   
    } catch (error) {
      if (error.status === 401) {
        setErrors({ invalidCredentials: 'Demo user login failed.' });
      }
    }
  };
  return (
    <div className='modal-login'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
  {/* Username/email input */}
  <label htmlFor="credential">Email</label>
  <input
    type="text"
    id="credential"
    value={credential}
    onChange={(e) => setCredential(e.target.value)}
    required
  />
  

  {/* Password input */}
  <label htmlFor="password">Password</label>
  <input
    type="password"
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
 {errors && errors.invalidCredentials && (
    <p className="error">{errors.invalidCredentials}</p>
  )}

  {/* Submit button */}
  <button type="submit" disabled={isSubmitDisabled}>Log In</button>
</form>

      <button onClick={handleDemoUserLogin} className="demo-user-button">Demo User</button>
    </div>
  );
}

export default LoginFormModal;
