import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { useGetDashboardDataMutation } from '../../slices/adminApiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { Container } from 'react-bootstrap';
import '../../styles/dashBoard.css'

const Dashboard = () => {
  const [dashBoardData, { isLoading }] = useGetDashboardDataMutation();

  Chart.register(CategoryScale);

  const [details, setDetails] = useState([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const responseFromApiCall = await dashBoardData();
        console.log('response dashboard: ', responseFromApiCall.data);
        setDetails(responseFromApiCall.data);
      };
      fetchData();
    } catch (error) {
      toast.error(error);
      console.error('Error fetching categories:', error);
    }
  }, [dashBoardData]);

  const currentDate = new Date();
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(currentDate);
    day.setDate(currentDate.getDate() - index);
    return day.toLocaleDateString(); 
  });

    const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); 
};

    const userData = {
  labels: lastSevenDays,
  datasets: [
    {
      label: 'New Users',
      data: lastSevenDays.map((day) => {
        const userDataForDay = details.newUserCounts && details.newUserCounts.find((item) => formatDate(item._id) === formatDate(day));
        return userDataForDay ? userDataForDay.count : 0;
      }),
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 2,
      fill: false,
    },
  ],
};

const postsData = {
  labels: lastSevenDays,
  datasets: [
    {
      label: 'New Posts',
      data: lastSevenDays.map((day) => {
        const postsDataForDay = details.newPostCounts && details.newPostCounts.find((item) => formatDate(item._id) === formatDate(day));
        return postsDataForDay ? postsDataForDay.count : 0;
      }),
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 2,
      fill: false,
    },
  ],
};


  const userOptions = {
    title: {
      display: true,
      text: 'Daily Joined Users',
    },
  };

 

  const postsOptions = {
    title: {
      display: true,
      text: 'Daily Created Posts',
    },
  };
  return (
    <Container>
      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>
        <div className="chart-container">
          {isLoading ? (
            <Loader />
          ) : (
            <Line data={userData} options={userOptions} />
          )}
        </div>
        <div className="chart-container">
          {isLoading ? (
            <Loader />
          ) : (
            <Line data={postsData} options={postsOptions} />
          )}
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
