import UsersDataTable from "../../components/adminComponents/UserDataTable";
import { useEffect,useState } from "react"
import { toast } from "react-toastify";
import { useGetUsersDataMutation } from "../../slices/adminApiSlice";
import Loader from "../../components/Loader";

const AdminUserManagementScreen = () => {

  const [usersData, setUsersData] = useState([]);
  const [usersDataFromAPI, { isLoading } ] = useGetUsersDataMutation();

  useEffect(() => {
    
    try {
      const fetchData = async () => {
        const responseFromApiCall = await usersDataFromAPI();
        const usersArray = responseFromApiCall.data.usersData;
        setUsersData(usersArray);
      };
      fetchData();
    } catch (error) {
      toast.error(error);
      console.error("Error fetching users:", error);
    }

  }, [usersDataFromAPI]);

  return (
    <div>
      <h1>Users List</h1>
      { isLoading ? <Loader/> : <UsersDataTable users={usersData} /> }
    </div>
  );
};

export default AdminUserManagementScreen;
