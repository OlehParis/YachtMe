
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
            <div className='newYacht'>
               <NavLink to='/spots/new' className='newYachtLink'>
                Create a New Yacht
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
