
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from './../../../../Images/logoYachtme.png'
import whiteLogo from './../../../../Images/logoYachtmeWhite.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

if(!sessionUser) {
  return (
    <header className={isScrolled ? 'header scrolled' : 'header transparent'}>
      <div className="logo-navbar">
        <NavLink to="/" >
        <img className='logo' src={isScrolled ? logo : whiteLogo} alt="Yachtme" />
        </NavLink>
      </div>
      {isLoaded && (
        <div className='profile'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </header>
  );} else {
    return (
      <header className={isScrolled ? 'header scrolled' : 'header transparent'}>
      <div className="logo-navbar">
        <NavLink to="/" >
           <img className='logo' src={isScrolled ? logo : whiteLogo} alt="Yachtme" />
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
    </header>
    )
  }
}

export default Navigation;
