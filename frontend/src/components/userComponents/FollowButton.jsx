import { useState, useEffect } from 'react';
import { useFollowArtistMutation, useUnFollowArtistMutation, useFollowedUsersMutation } from '../../slices/userApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const FollowButton = ({ artistId, onFollowChange }) => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowRequested, setIsFollowRequested] = useState(false);
  const [fetchingFollowedUsers] = useFollowedUsersMutation();
  const [followArtist] = useFollowArtistMutation();
  const [unFollowArtist] = useUnFollowArtistMutation();

  useEffect(() => {
    // Fetch the follow state when the component mounts
    const fetchFollowedUsers = async () => {
      try {
        const response = await fetchingFollowedUsers();
        const followingIds = response.data.followers.map((follower) => follower._id);
        setIsFollowing(followingIds?.includes(artistId));
        setIsFollowRequested(response.data.followRequestsSend.some((request) => request._id === artistId));
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
        console.error('Error fetching followed users:', error);
      }
    };

    if (userInfo) {
      fetchFollowedUsers();
    }
  }, [artistId, userInfo, fetchingFollowedUsers]);

  const handleFollow = async () => {
    try {
      const response = await followArtist(artistId);

      if (response.data.status === 'success') {
        toast.success('Started Following New Artist');
        setIsFollowing(true);
        setIsFollowRequested(false);
        onFollowChange(artistId, true); // Update the count locally
      } else if (response.data.status === 'requested') {
        toast.info('Follow Request sent');
        setIsFollowing(false);
        setIsFollowRequested(true);
        onFollowChange(artistId, false);
      } else {
        console.error('Error following user:', response);
        toast.error('Failed to follow artist');
      }
    } catch (err) {
      console.error('Error following user:', err);
      toast.error(err?.data?.message || err?.error);
    }
  };

  const handleUnFollow = async () => {
    try {
      const response = await unFollowArtist(artistId);

      if (response.data.status === 'success') {
        toast.success('UnFollowed Artist');
        setIsFollowing(false);
        setIsFollowRequested(false);
        onFollowChange(artistId, false); // Update the count locally
      } else {
        console.error('Error unFollowing user:', response);
        toast.error('Failed to unFollow artist');
      }
    } catch (err) {
      console.error('Error unFollowing user:', err);
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <button
      className="followButton"
      style={{
        color: 'white',
        backgroundColor: isFollowRequested ? '#CCCCCC' : '#007BFF',
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '700',
        padding: '8px 16px',
        marginRight: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      onClick={isFollowing ? handleUnFollow : handleFollow}
      disabled={isFollowRequested}
    >
      {isFollowRequested ? 'Requested' : isFollowing ? 'UnFollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
