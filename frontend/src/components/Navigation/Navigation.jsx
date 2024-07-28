
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from './../../../../Images/logoYachtme.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
if(!sessionUser) {
  return (
    <div className='header'>
      <div className="logo-navbar">
        <NavLink to="/" >
           <img className='logo' src={logo} alt="ABNB" />
        </NavLink>
      </div>
      {isLoaded && (
        <div className='profile'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );} else {
    return (
      <div className='header'>
      <div className="logo-navbar">
        <NavLink to="/" >
           <img className='logo' src={logo} alt="ABNB" />
        </NavLink>
      </div>
   
      {isLoaded && (
        <div className='profile'>
            <div className='newSpot'>
               <NavLink to='/spots/new' className='newSpotLink'>
                Create a New Spot
                </NavLink>
            </div>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
    )
  }
}

export default Navigation;
