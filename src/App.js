import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from './Components/PrivateRoute'
import Navbar from './Components/Navbar'
import Explore from './Pages/Explore'
import Offers from './Pages/Offers'
import Category from './Pages/Category'
import Profile from './Pages/Profile'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import ForgotPassword from './Pages/ForgotPassword'
import CreateListing from './Pages/CreateListing'

const App = () =>
{
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/profile' element={<PrivateRoute />} >
            {/* This nested route is Outlet in PrivateRoute */}
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/create-listing' element={<CreateListing />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
