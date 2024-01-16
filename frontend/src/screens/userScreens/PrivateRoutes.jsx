import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCheckBlockMutation } from '../../slices/userApiSlice';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

const PrivateRoutes = () => {
    const { userInfo } = useSelector((state) => state.userAuth);
    const [blocked, setBlocked] = useState(false);
    const [blockCheck] = useCheckBlockMutation();

    useEffect(() => {
        const checkBlocked = async () => {
            try {
                if (userInfo) {
                    const response = await blockCheck({ id: userInfo.id });
                    if (response.data.is_blocked) {
                        setBlocked(true);
                        toast.error("Your account is blocked");
                    }
                } else {
                    <Navigate to='/login' replace />;
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkBlocked();
    }, []);

    if (userInfo && !blocked) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
}

export default PrivateRoutes;
