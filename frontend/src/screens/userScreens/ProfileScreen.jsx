import { Link, useParams } from 'react-router-dom';
import CategoriesTab from '../../components/userComponents/CategoriesTab';
import UserProfile from '../../components/userComponents/UserProfile';
import UserPosts from '../../components/userComponents/UserPosts';
import { useState } from 'react';
import ChatButton from "../../components/userComponents/ChatButton";
import FollowButton from '../../components/userComponents/FollowButton';

const ProfileScreen = () => {
  const { id } = useParams();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFollowRequested, setIsFollowRequested] = useState(false);

  // If there's no ID in the params, it's the current user's profile
  const isCurrentUserProfile = !id;
  
  const handleFollowChange = (isFollowed) => {
    setIsFollowed(isFollowed);
    setIsFollowRequested(false);
  };

  return (
    <div>
      <CategoriesTab />
      <div style={{ display: 'flex' }}>
        <div>
          <UserProfile />
          {isCurrentUserProfile ? (
            <Link to="/updateProfile">
              <div
                style={{
                  paddingLeft: 85.85,
                  paddingTop: 20,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  display: 'inline-flex',
                  cursor: 'pointer',
                }}
              >
                <button
                  style={{
                    color: 'white', 
                    backgroundColor: '#007BFF',  
                    fontSize: 16,
                    fontFamily: 'Roboto',
                    fontWeight: '700',
                    wordWrap: 'break-word',
                    padding: '8px 16px',  
                    border: 'none',
                    borderRadius: '4px',  
                    cursor: 'pointer',
                  }}
                >
                  Edit Profile
                </button>
              </div>
            </Link>
          ) : (
              // Show the "Follow" button for other user's profile
            <div
              style={{
                paddingLeft: 60.85,
                paddingTop: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                cursor: 'pointer'
              }}
            >
              {/* <FollowButton artistId={id} onFollowChange={(isFollowed) => handleFollowChange(isFollowed)} /> */}
              <FollowButton artistId={id} onFollowChange={handleFollowChange} />
              <ChatButton userId={id} />
            </div>
          )}
        </div>
      <UserPosts />
      </div>
    </div>
  );
};

export default ProfileScreen;
