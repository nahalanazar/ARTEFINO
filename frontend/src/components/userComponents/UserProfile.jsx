import { ChakraProvider } from "@chakra-ui/react"
import '../../styles/userProfile.css';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserProfileMutation } from '../../slices/userApiSlice'
import { useParams } from "react-router-dom";
// import FollowModal from './FollowersModal';
// import FollowingModal from "./FollowingsModal";
const FollowModal = lazy(() => import('./FollowersModal'))
const FollowingModal = lazy(() => import('./FollowingsModal'))
const UserProfile = () => {
  const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
  const { userInfo } = useSelector((state) => state.userAuth);
  const { id } = useParams()
  const [getUserProfile] = useGetUserProfileMutation()
  const [userDetails, setUserDetails] = useState({});
  const [memberSince, setMemberSince] = useState('');
  const imageUrl = userDetails.profileImageName? userDetails.profileImageName: VITE_PROFILE_IMAGE_DIR_PATH + 'defaultImage.jpeg'
  // Determine if it's the user's own profile
  const isOwnProfile = userInfo && userDetails && userDetails._id === userInfo.id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userIdToFetch = String(id || userInfo.id); // Use id from params if available, otherwise use current user's id
        const response = await getUserProfile(userIdToFetch).unwrap();
        setUserDetails(response.user);
        const createdAt = new Date(response.user.createdAt);
        const formattedJoiningDate = createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        setMemberSince(`Member since: ${formattedJoiningDate}`);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    if (userInfo) {
      fetchUserDetails();
    }
  }, [getUserProfile, id, userInfo]);

  if (!userInfo) {
    return <div>Login To see Profile</div>;
  }
  
  const updateFollowersCountOnRemove = (removedUserId) => {
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      followers: prevUserDetails.followers.filter(
        (follower) => follower._id !== removedUserId
      ),
    }));
  };


  return (
    <ChakraProvider>
      <div className="profile-container">
        <div className="profile-box">
          <div className="profile-image-container">
            <img
              className="profile-image"
              src={imageUrl}
              alt="Profile"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
                marginTop: '5px',
                marginLeft: '35px',
                marginBottom: '10px',
              }}
            />
          </div>
          <div className="profile-details-container">
            <div className="profile-name">
              <div className="name">{userDetails.name}</div>
            </div>
            <div className="member-since">
              <div className="icon"></div>
              <div className="label">{memberSince}</div>
            </div>
            <div className="follower-following">
              <div className="followers">
                <div className="label">
                  <Suspense fallback={<div>Loading...</div>}>
                    <FollowModal
                      userDetails={userDetails}
                      isOwnProfile={isOwnProfile} 
                      onUpdateFollowersCount={updateFollowersCountOnRemove}
                    />
                  </Suspense>
                </div>
                <div className="count">{userDetails.followers?.length || 0}</div>
              </div>
              <div className="icon"></div>
              <div className="following">
                <div className="label">
                  <Suspense fallback={<div>Loading...</div>}>
                    <FollowingModal
                      userDetails={userDetails} 
                    />
                  </Suspense>
                </div>
                <div className="count">{userDetails.following?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default UserProfile;