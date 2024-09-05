import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import {  Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Navigation.css'

function ProfileButton({ user }) {
 const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/')
    closeMenu();
    

  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='profilebutton' onClick={toggleMenu}>
      <FaBars size={35}/>   <FaUserCircle size={35} /> 
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li> hello,  {user.firstName} </li>
          
            <li> <Link  className='linkManageYacht' to='/users/profile' >User Profile</Link></li>
            <hr />
           <li> <Link  className='linkManageYacht' to="/yachts/current">Your Fleet</Link></li>
       
           <li> <Link  className='linkManageYacht' to="/reviews/current">Manage Reviews</Link></li>
           <li> <Link  className='linkManageYacht' to="/bookings/manage">Your Bookings</Link></li>

            <li>
              <button id='logoutButton'onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
