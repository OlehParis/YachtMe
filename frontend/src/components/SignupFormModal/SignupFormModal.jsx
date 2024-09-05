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

  // Helper function to check if a value is a valid number
  const isNumber = (value) => /^[0-9]+$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!email.includes('@')) {
      validationErrors.email = "Please enter valid email";
    }
    if (!isNumber(phoneNumber)) {
      validationErrors.phoneNumber = "Phone number must be numeric";
    } else if (phoneNumber.length <= 6) {
      validationErrors.phoneNumber = "Phone number must be longer than 6 characters";
    }
    if (firstName.length <= 1) {
      validationErrors.firstName = "Please type your first name ";
    }
    if (lastName.length <= 1) {
      validationErrors.lastName = "Please type your last name";
    }
    if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords must match";
    }

    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
  };

  return (
    <div className='modal-signup'>
      <h1>Sign Up</h1>
      
      <form onSubmit={handleSubmit}>
        <label>
        <div className='error-val'>
          {errors.email && <p className="error">{errors.email}</p>}
          </div> 
         <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             
            placeholder='Email'
          />
        </label>

        <label>
        <div className='error-val'>
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          </div> 
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
             
            placeholder='Phone Number'
          />
        </label>

        <label>
        <div className='error-val'>
          {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div> 
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
             
            placeholder='First Name'
          />
        </label>

        <label>
        <div className='error-val'>
          {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div> 
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
             
            placeholder='Last Name'
          />
        </label>

        <label>
        <div className='error-val'>{errors.password && <p className="error">{errors.password}</p>}
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             
            placeholder='Password'
          />
        </label>

        <label>
        <div className='error-val'>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
         </div> <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
             
            placeholder='Confirm Password'
          />
        </label>

        <label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder='Referral Code (optional)'
          />
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
