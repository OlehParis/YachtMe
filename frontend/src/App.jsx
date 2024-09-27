import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import axios from 'axios';
import YachtCard from './components/Yachts/Yachts';
import Navigation from './components/Navigation/Navigation';
import YachtDetails from './components/YachtDetails/YachtDetails';
import CreateYacht from './components/CreateYacht/CreateYacht';
import ManageYachts from './components/Yachts/ManageYachts'
import EditYacht from './components/CreateYacht/EditYacht';
import ManageReviews from './components/YachtDetails/ManageReviews';
import YourBookings from './components/Yachts/YourBookings';
import ImageGallery from './components/YachtDetails/ImageGallery';
import UserProfile from './components/ManageProfile/ManageProfile';
import CityYachts from './components/Yachts/CityYachts';

function App() {
  const dispatch = useDispatch();
  const yachts = useSelector(state => state.yachts.data);
  const reviews = useSelector(state => state.reviews.data)
  const [isLoaded, setIsLoaded] = useState(false);
  const url = `https://yachtme.onrender.com/`;
  const interval = 30000;
 
 // Function to ping the server to keep it alive
 function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);
  
// Effect to set the interval to ping the server every 30 seconds
useEffect(() => {
  const intervalId = setInterval(reloadWebsite, interval);
  return () => clearInterval(intervalId); // Clear interval on component unmount
}, []);

  const Layout = () => (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    
    
    </>
  );

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element:   <YachtCard yacht= {yachts} /> 
        },
        {
          path: '/users/profile',
          element:   <UserProfile  /> 
        },
        {
          path: "yachts/:yachtId",
          element:  <YachtDetails yacht = {yachts} />
        },
        {
          path: "yachts/new",
          element:  <CreateYacht yacht = {yachts}/>
        },
        {
          path: "yachts/current",
          element:  <ManageYachts yacht = {yachts}/>
        },
        {
          path: "yachts/:yachtId/edit",
          element:  <EditYacht yacht = {yachts}/>
        },
        {
          path: "/:city",
          element:  <CityYachts/>
        },
         {
          path: "reviews/current",
          element:  <ManageReviews review = {reviews}/>
        },
    
        {
          path: "bookings/manage",
          element:  <YourBookings yacht = {yachts}/>
        },
        {
          path: "yachts/:yachtId/gallery",
          element:  <ImageGallery  />
        },

      ]
    }
  ]);
 
  return (
    <RouterProvider router={router} />
  );
}

export default App;
