// FollowButton.jsx
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import {
  useFollowArtistMutation,
  useUnFollowArtistMutation,
  useFollowedUsersMutation,
} from '../../slices/userApiSlice';
import { toast } from 'react-toastify';

const FollowButton = ({ userId, onFollow, onUnfollow }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isFollowRequested, setIsFollowRequested] = useState(false);
  const [followArtist] = useFollowArtistMutation();
  const [unFollowArtist] = useUnFollowArtistMutation();
  const [fetchingFollowedUsers] = useFollowedUsersMutation();

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const response = await fetchingFollowedUsers();
        const followerIds = response.data.followers.map((follower) => follower._id);
        setFollowedUsers(followerIds);
        setIsFollowed(followerIds.includes(userId));
        setIsFollowRequested(response.data.followRequests.includes(userId));
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
        console.error('Error fetching followed users:', error);
      }
    };

    fetchFollowedUsers();
  }, [userId, fetchingFollowedUsers]);

  const handleFollow = async () => {
    try {
      const artistId = String(userId);

      // If the user is already following or has sent a follow request, do nothing
      if (isFollowed || isFollowRequested) {
        return;
      }

      const response = await followArtist(artistId);

      if (response.data.status === 'success') {
        toast.success('Started Following New Artist');
        setIsFollowed(true);
        onFollow();
      } else if (response.data.status === 'requested') {
        toast.info('Follow request sent');
        setIsFollowRequested(true);
      } else {
        console.error('Error following user:', response);
        toast.error('Failed to follow artist');
      }
    } catch (err) {
      console.error('Error following user:', err);
      toast.error(err?.data?.message || err?.error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const artistId = String(userId);
      const response = await unFollowArtist(artistId);

      if (response.data.status === 'success') {
        toast.warning('Unfollowed Artist');
        setIsFollowed(false);
        onUnfollow();
      } else {
        console.error('Error unfollowing user:', response);
        toast.error('Failed to unfollow artist');
      }
    } catch (err) {
      console.error('Error unfollowing user:', err);
      toast.error(err?.data?.message || err?.error);
    }
  };


  return (
    <Button
      variant="primary"
      onClick={() => (isFollowed ? handleUnfollow() : (isFollowRequested ? null : handleFollow()))}
      disabled={false} 
    >
      {isFollowed ? 'Unfollow' : (isFollowRequested ? 'Requested' : 'Follow')}
    </Button>
  );
};

export default FollowButton;
