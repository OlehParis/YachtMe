import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import YachtCard from './components/Yachts/Yachts';
// import { fetchYachts } from './store/yachts';
import Navigation from './components/Navigation/Navigation';
import YachtDetails from './components/YachtDetails/YachtDetails';
import CreateYacht from './components/CreateYacht/CreateYacht';
import ManageYachts from './components/Yachts/ManageYachts'
import EditYacht from './components/CreateYacht/EditYacht';
import ManageReviews from './components/YachtDetails/ManageReviews';
// import RequestToBook from './components/YachtDetails/RequestToBook';
import YourBookings from './components/Yachts/YourBookings';
import ImageGallery from './components/YachtDetails/ImageGallery';
import UserProfile from './components/ManageProfile/ManageProfile';
import CityYachts from './components/Yachts/CityYachts';

function App() {
  const dispatch = useDispatch();
  const yachts = useSelector(state => state.yachts.data);
  const reviews = useSelector(state => state.reviews.data)
  const [isLoaded, setIsLoaded] = useState(false);
 
 

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);
  
  // useEffect(() => {
  //   dispatch(fetchYachts()); 
  // }, [dispatch]);

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
        // {
        //   path: "yachts/:yachtId/booking",
        //   element:  <RequestToBook />
        // },
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
