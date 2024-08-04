import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          phoneNumber,
          firstName,
          lastName,
          password,
          referralCode
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };
  const isDisabled = email.trim() === ""  || phoneNumber.trim().length <= 6   || firstName.trim() === "" || lastName.trim() === "" || password.trim().length < 6 || confirmPassword.trim() === "" || confirmPassword.trim() != password.trim();
  
  return (
   <div className='modal-signup'>
     <h1>Sign Up</h1> 
     <div id="error-placeholder">
     {/* {errors.confirmPassword && (
          <p id='passwordErrors'>{errors.confirmPassword}</p>
        )} */}
      <p id='passwordErrors'>{errors.confirmPassword}</p>
      </div>
      {errors.email && <p>{errors.email}</p>}
      {errors.phoneNumber && <p>{errors.phoneNumber}</p>}
      {errors.firstName && <p>{errors.firstName}</p>}
      {errors.lastName && <p>{errors.lastName}</p>}
      {errors.referralCode && <p>{errors.referralCode}</p>}
      
      <form onSubmit={handleSubmit}>
      <span className="required">*</span>
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={'Email'}
          />
        </label>
       
        <label>
        <span className="required">*</span>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder='phoneNumber'
          />
        </label>
        <span className="required">*</span>
        <label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder='First Name'
          />
        </label>
      
        <label>
        <span className="required">*</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder='Last Name'
          />
        </label>
        
        <label>
        <span className="required">*</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
        <span className="required">*</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirm Password'
          />
        </label>
        <label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            
            placeholder='ReferralCode'
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
       
        <button type="submit" disabled={isDisabled}>Sign Up</button>
      </form>
      </div>
 
  );
}

export default SignupFormModal;
