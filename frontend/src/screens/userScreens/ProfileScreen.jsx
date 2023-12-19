import { Link, useParams } from 'react-router-dom';
import CategoriesTab from '../../components/userComponents/CategoriesTab';
import UserProfile from '../../components/userComponents/UserProfile';
import UserPosts from '../../components/userComponents/UserPosts';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useFollowedUsersMutation, useFollowArtistMutation, useUnFollowArtistMutation } from '../../slices/userApiSlice';
import { toast } from "react-toastify";
import ChatButton from "../../components/userComponents/ChatButton";


const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const [followedUsers, setFollowedUsers] = useState([]);
  const { id } = useParams();
  const [isFollowed, setIsFollowed] = useState(false);
  

  // If there's no ID in the params, it's the current user's profile
  const isCurrentUserProfile = !id;
  const [fetchingFollowedUsers] = useFollowedUsersMutation()
  const [followArtist] = useFollowArtistMutation()
  const [unFollowArtist] = useUnFollowArtistMutation()

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const response = await fetchingFollowedUsers();
        const followerIds = response.data.followers.map((follower) => follower._id);
        setFollowedUsers(followerIds);
        setIsFollowed(followerIds.includes(id));
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
        console.error('Error fetching followed users:', error);
      }
    };

    fetchFollowedUsers();
  }, [id, fetchingFollowedUsers]);

const handleFollow = async (userIdToFollow) => {
  try {
    const artistId = String(userIdToFollow);
    const response = await followArtist(artistId);
    
    if (response.data.status === 'success') {
      toast.success("Started Following New Artist");
      setFollowedUsers([...followedUsers, userIdToFollow]);
      setIsFollowed(true);
    } else {
      console.error('Error following user:', response);
      toast.error("Failed to follow artist");
    }
  } catch (err) {
    console.error('Error following user:', err);
    toast.error(err?.data?.message || err?.error);
  }
};

const handleUnFollow = async (userIdToUnFollow) => {
  try {
    const artistId = String(userIdToUnFollow);
    const response = await unFollowArtist(artistId);

    if (response.data.status === 'success') {
      toast.success("UnFollowed Artist");
      setFollowedUsers(followedUsers.filter((id) => id !== userIdToUnFollow));
      setIsFollowed(false);
    } else {
      console.error('Error unFollowing user:', response);
      toast.error("Failed to unFollow artist");
    }
  } catch (err) {
    console.error('Error unFollowing user:', err);
    toast.error(err?.data?.message || err?.error);
  }
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
              <button
                className="followButton"
                style={{
                  color: 'white',  
                  backgroundColor: '#007BFF',  
                  fontSize: 16,
                  fontFamily: 'Roboto',
                  fontWeight: '700',
                  padding: '8px 16px',  
                  marginRight: '10px',
                  border: 'none',  
                  borderRadius: '4px',  
                  cursor: 'pointer',
                  }}
                  onClick={() => (isFollowed ? handleUnFollow(id) : handleFollow(id))}
              >
                {isFollowed ? 'UnFollow' : 'Follow'}
              </button>
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
