import { Outlet, useLocation } from "react-router-dom";
// import {Container } from "react-bootstrap";
import UserHeader from "./components/userComponents/Header";
import AdminHeader from "./components/AdminComponents/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import ChatProvider from "./components/context/ChatProvider.jsx";


const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
// console.error = () => {};

  return (
    <>
      <ChatProvider>
        {isAdminPage ? <AdminHeader /> : <UserHeader />}
        
        <ToastContainer />  
      
        <Outlet />
      </ChatProvider>
    </>
  );
}

export default App;
