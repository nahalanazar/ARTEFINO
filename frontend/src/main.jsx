// frontend entry point

import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ErrorPage from './components/userComponents/ErrorPage.jsx';
//? ==================================== User Screens Import ====================================
import UserPrivateRoutes from './screens/userScreens/PrivateRoutes.jsx';
import UserHomeScreen from './screens/userScreens/HomeScreen.jsx';
const UserLoginScreen = lazy(() => import('./screens/userScreens/LoginScreen.jsx'));
const UserRegisterScreen = lazy(() => import('./screens/userScreens/RegisterScreen.jsx'));
const UserProfileScreen = lazy(() => import('./screens/userScreens/ProfileScreen.jsx'));
const UserUpdateProfileScreen = lazy(() => import('./screens/userScreens/UpdateProfileScreen.jsx'));
const UserOtpVerifyScreen = lazy(() => import('./screens/userScreens/OtpScreen.jsx'));
const ForgotPasswordScreen = lazy(() => import('./screens/userScreens/ForgotPasswordScreen.jsx'));
const PasswordOtpVerify = lazy(() => import('./screens/userScreens/PasswordOtpVerify.jsx'));
const ResetPassword = lazy(() => import('./screens/userScreens/ResetPasswordScreen.jsx'));
const UserSellScreen = lazy(() => import('./screens/userScreens/SellScreen.jsx'));
const PostDetailScreen = lazy(() => import('./screens/userScreens/PostDetailScreen.jsx'));
const ChatScreen = lazy(() => import('./screens/userScreens/ChatScreen.jsx'));
const UpdatePostScreen = lazy(() => import('./screens/userScreens/UpdatePostScreen.jsx'));

// import UserLoginScreen from './screens/userScreens/LoginScreen.jsx';
// import UserRegisterScreen from './screens/userScreens/RegisterScreen.jsx';
// import UserProfileScreen from './screens/userScreens/ProfileScreen.jsx'
// import UserUpdateProfileScreen from './screens/userScreens/UpdateProfileScreen.jsx';
// import UserOtpVerifyScreen from './screens/userScreens/OtpScreen.jsx';
// import ForgotPasswordScreen from './screens/userScreens/ForgotPasswordScreen.jsx'
// import PasswordOtpVerify from './screens/userScreens/PasswordOtpVerify.jsx'
// import ResetPassword from './screens/userScreens/ResetPasswordScreen.jsx'
// import UserSellScreen from './screens/userScreens/SellScreen.jsx'
// import PostDetailScreen from './screens/userScreens/PostDetailScreen.jsx'
// import ChatScreen from './screens/userScreens/ChatScreen.jsx'
// import UpdatePostScreen from './screens/userScreens/UpdatePostScreen.jsx'

//? ==================================== Admin Screens Import ====================================
import AdminHomeScreen from './screens/adminScreens/HomeScreen.jsx'
import AdminPrivateRoutes from './screens/adminScreens/PrivateRoutes.jsx';
const AdminLoginScreen = lazy(() => import('./screens/adminScreens/LoginScreen.jsx'));
const AdminRegisterScreen = lazy(() => import('./screens/adminScreens/RegisterScreen.jsx'));
const AdminProfileScreen = lazy(() => import('./screens/adminScreens/ProfileScreen.jsx'));
const UsersManagementScreen = lazy(() => import('./screens/adminScreens/UserManagementScreen.jsx'));
const CategoriesManagementScreen = lazy(() => import('./screens/adminScreens/CategoryManagementScreen.jsx'));
const ReportedPostsScreen = lazy(() => import('./screens/adminScreens/ReportedPostsScreen.jsx'));

// import AdminLoginScreen from './screens/adminScreens/LoginScreen.jsx'
// import AdminRegisterScreen from './screens/adminScreens/RegisterScreen.jsx'
// import AdminProfileScreen from './screens/adminScreens/ProfileScreen.jsx';
// import UsersManagementScreen from './screens/adminScreens/UserManagementScreen.jsx';
// import CategoriesManagementScreen from './screens/adminScreens/CategoryManagementScreen.jsx';
// import ReportedPostsScreen from './screens/adminScreens/ReportedPostsScreen.jsx'

export { UserLoginScreen };
  
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>} >
<Route path='*' element={<ErrorPage />} />
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
        <Route path='/admin/manage-categories' element={<CategoriesManagementScreen />} />
        <Route path='/admin/reported-posts' element={ <ReportedPostsScreen /> } />        
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          {/* The part of the UI that might show a loading state */}
            <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    {/* </React.StrictMode> */}
  </Provider>,
);


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     {/* <React.StrictMode> */}
//       <RouterProvider router={router} />
//     {/* </React.StrictMode> */}
//   </Provider>
// )
