// frontend entry point

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'


//? ==================================== User Screens Import ====================================
import UserPrivateRoutes from './screens/userScreens/PrivateRoutes.jsx';
import UserHomeScreen from './screens/userScreens/HomeScreen.jsx';
import UserLoginScreen from './screens/userScreens/LoginScreen.jsx';
import UserRegisterScreen from './screens/userScreens/RegisterScreen.jsx';
import UserProfileScreen from './screens/userScreens/ProfileScreen.jsx'
import UserUpdateProfileScreen from './screens/userScreens/UpdateProfileScreen.jsx';
import UserOtpVerifyScreen from './screens/userScreens/OtpScreen.jsx';
import ForgotPasswordScreen from './screens/userScreens/ForgotPasswordScreen.jsx'
import PasswordOtpVerify from './screens/userScreens/PasswordOtpVerify.jsx'
import ResetPassword from './screens/userScreens/ResetPasswordScreen.jsx'
import UserSellScreen from './screens/userScreens/SellScreen.jsx'
import PostDetailScreen from './screens/userScreens/PostDetailScreen.jsx'
import ChatScreen from './screens/userScreens/ChatScreen.jsx'
import UpdatePostScreen from './screens/userScreens/UpdatePostScreen.jsx'

//? ==================================== Admin Screens Import ====================================
import AdminHomeScreen from './screens/adminScreens/HomeScreen.jsx'
import AdminLoginScreen from './screens/adminScreens/LoginScreen.jsx'
import AdminRegisterScreen from './screens/adminScreens/RegisterScreen.jsx'
import AdminPrivateRoutes from './screens/adminScreens/PrivateRoutes.jsx';
import AdminProfileScreen from './screens/adminScreens/ProfileScreen.jsx';
import UsersManagementScreen from './screens/adminScreens/UserManagementScreen.jsx';
import CategoriesManagementScreen from './screens/adminScreens/CategoryManagementScreen.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={ <App/> } >

      { /* ===================================== User Routes ===================================== */}
      <Route index={true} path='/' element={<UserHomeScreen className="w-100" /> } />
      <Route path='/login' element={ <UserLoginScreen /> } />
      <Route path='/register' element={ <UserRegisterScreen /> } />
      <Route path='/otpVerify' element={ <UserOtpVerifyScreen /> } />
      <Route path='/forgotPassword' element={ <ForgotPasswordScreen /> } />
      <Route path='/passwordOtpVerify' element={<PasswordOtpVerify />} />
      <Route path='/resetPassword' element={<ResetPassword />} />

      {/* USER PRIVATE ROUTES */}
      <Route path='' element={ <UserPrivateRoutes /> } >    
        <Route path='/updateProfile' element={<UserUpdateProfileScreen />} />
        <Route path='/profile/:id?' element={<UserProfileScreen />} />
        <Route path='/sell' element={<UserSellScreen />} />
        <Route path={`/postDetails/:postId`} element={<PostDetailScreen />} />
        <Route path='/chat' element={<ChatScreen />} />
        <Route path={`/updatePost/:postId`} element={<UpdatePostScreen />} />
      </Route>

      { /* ===================================== Admin Routes ===================================== */ }
      <Route path='/admin' element={ <AdminHomeScreen /> } />
      <Route path='/admin/login' element={ <AdminLoginScreen /> } />
      <Route path='/admin/register' element={ <AdminRegisterScreen /> } />

      {/* ADMIN PRIVATE ROUTES */}
      <Route path='' element={ <AdminPrivateRoutes /> } >
        <Route path='/admin/profile' element={ <AdminProfileScreen /> } />
        <Route path='/admin/manage-users' element={<UsersManagementScreen />} />
        <Route path='/admin/manage-categories' element={ <CategoriesManagementScreen /> } />
      </Route>
    </Route>

  )

);



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)
