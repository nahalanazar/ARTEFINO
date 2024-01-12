import { ChakraProvider } from "@chakra-ui/react"
import '../../styles/userProfile.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const FollowModal = lazy(() => import('./FollowersModal'))
const FollowingModal = lazy(() => import('./FollowingsModal'))
const UserProfile = ({UserDetails, fetchUserDetails, updateFollowersCountOnRemove}) => {
  const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
  const { userInfo } = useSelector((state) => state.userAuth);
  const [memberSince, setMemberSince] = useState('');
  const imageUrl = UserDetails.profileImageName? UserDetails.profileImageName: VITE_PROFILE_IMAGE_DIR_PATH
  // Determine if it's the user's own profile
  const isOwnProfile = userInfo && UserDetails && UserDetails._id === userInfo.id;

  useEffect(() => {
    if (UserDetails.createdAt) {
      const createdAt = new Date(UserDetails.createdAt);
      const formattedJoiningDate = createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setMemberSince(`Member since: ${formattedJoiningDate}`);
    }
  }, [UserDetails]);

  if (!userInfo) {
    return <div>Login To see Profile</div>;
  }


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
              <div className="name">{UserDetails.name}</div>
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
                      userDetails={UserDetails}
                      isOwnProfile={isOwnProfile}
                      onUpdateFollowersCount={updateFollowersCountOnRemove}
                      fetchUserDetails={fetchUserDetails}
                    />
                  </Suspense>
                </div>
                <div className="count">{UserDetails.followers?.length  || 0}</div>
              </div>
              <div className="icon"></div>
              <div className="following">
                <div className="label">
                  <Suspense fallback={<div>Loading...</div>}>
                    <FollowingModal
                      userDetails={UserDetails} 
                      fetchUserDetails={fetchUserDetails}
                    />
                  </Suspense>
                </div>
                <div className="count">{ UserDetails.following?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default UserProfile;