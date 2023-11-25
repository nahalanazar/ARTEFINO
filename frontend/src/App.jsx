import { Outlet, useLocation } from "react-router-dom";
import {Container } from "react-bootstrap";
import UserHeader from "./components/userComponents/Header";
import AdminHeader from "./components/AdminComponents/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'



const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>

      {isAdminPage ? <AdminHeader /> : <UserHeader />}
      
      <ToastContainer />  
    
      <Outlet />
   
    </>
  );

}

export default App;
