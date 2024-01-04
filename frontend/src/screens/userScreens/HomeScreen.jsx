// import Hero from '../../components/userComponents/Hero'
import CategoriesTab from '../../components/userComponents/CategoriesTab'
import Posts from '../../components/userComponents/Posts'
import UserProfile from '../../components/userComponents/UserProfile'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useGetUserProfileMutation } from '../../slices/userApiSlice'
import { useSelector } from 'react-redux'
// import ArtistsList from '../../components/userComponents/ArtistsList'
const ArtistsList = lazy(() => import('../../components/userComponents/ArtistsList'))


  
const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userDetails, setUserDetails] = useState({})
  const [getUserProfile] = useGetUserProfileMutation()
  const { userInfo } = useSelector((state) => state.userAuth);

  useEffect(() => {
    
    if (userInfo) {
      fetchUserDetails();
    }
  }, [getUserProfile, userInfo]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const fetchUserDetails = async () => {
      try {
        const userIdToFetch = String(userInfo.id); // Use id from params if available, otherwise use current user's id
        const response = await getUserProfile(userIdToFetch).unwrap();
        setUserDetails(response.user)
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
  };

  const updateFollowersCountOnRemove = (removedUserId) => {
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      followers: prevUserDetails.followers.filter(
        (follower) => follower._id !== removedUserId
      ),
    }));
  };
  
  return (
    <>
      <CategoriesTab selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} />
      {/* <Hero /> */}
       <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            <UserProfile UserDetails={userDetails} fetchUserDetails={fetchUserDetails} updateFollowersCountOnRemove={updateFollowersCountOnRemove} />
          </div>

          <div className="col-md-6 col-12">
            <Posts selectedCategory={selectedCategory} />
          </div>
 
          <div className="col-md-3 d-none d-md-block">
            <Suspense fallback={<div>Loading...</div>}>
              <ArtistsList fetchUserDetails={fetchUserDetails} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeScreen