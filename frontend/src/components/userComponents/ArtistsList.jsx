import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { useGetArtistsMutation, useFollowArtistMutation, useUnFollowArtistMutation } from '../../slices/userApiSlice';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const ArtistsList = () => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const [getArtists] = useGetArtistsMutation();
  const [artists, setArtists] = useState([]);
  const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
  const [followArtist] = useFollowArtistMutation();
  const [unFollowArtist] = useUnFollowArtistMutation();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await getArtists();
        const artistsWithFollowStatus = response.data.map(artist => {
          return {
            ...artist,
            isFollowRequested: artist.isPrivate && artist.followRequests.includes(userInfo.id),
          };
        });
        setArtists(artistsWithFollowStatus);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (userInfo) {
      fetchArtists();
    }
  }, [getArtists, userInfo]);


  const handleFollow = async (userIdToFollow) => {
    try {
      const artistId = String(userIdToFollow);

      // Check if the artist is already followed
      const isAlreadyFollowed = artists.some((artist) => artist._id === userIdToFollow && artist.isFollowed);

      // If already followed, unfollow; otherwise, follow
      if (isAlreadyFollowed) {
        const response = await unFollowArtist(artistId);

        if (response.data.status === 'success') {
          toast.warning('Un Followed');
          setArtists((prevArtists) =>
            prevArtists.map((artist) =>
              artist._id === userIdToFollow
                ? { ...artist, isFollowed: false, isFollowRequested: false }
                : artist
            )
          );
        } else {
          console.error('Error un Following user:', response);
          toast.error('Failed to un Follow artist');
        }
      } else {
        const response = await followArtist(artistId);

        if (response.data.status === 'success') {
          toast.success('Started Following New Artist');
          setArtists((prevArtists) =>
            prevArtists.map((artist) =>
              artist._id === userIdToFollow
                ? { ...artist, isFollowed: true, isFollowRequested: false }
                : artist
            )
          );
        } else if (response.data.status === 'requested') {
          toast.info('Follow request sent');
          setArtists((prevArtists) =>
            prevArtists.map((artist) =>
              artist._id === userIdToFollow
                ? { ...artist, isFollowed: false, isFollowRequested: true }
                : artist
            )
          );
        } else {
          console.error('Error following user:', response);
          toast.error('Failed to follow artist');
        }
      }
    } catch (err) {
      console.error('Error following user:', err);
      toast.error(err?.data?.message || err?.error);
    }
  };

  if (!userInfo) {
    return <div>Login To Get Artists Suggestion</div>;
  }

  return (
    <>
      <h6>Suggested Artists</h6>
      {artists?.map((artist) => (
        <Card key={artist._id} style={{ width: '17rem', marginBottom: '20px' }}>
          <Card.Body style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={artist.profileImageName ? artist.profileImageName : VITE_PROFILE_IMAGE_DIR_PATH + 'defaultImage.jpeg'}
              alt="Profile"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '10px',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/profile/${artist._id}`)}
            />
            <span
              style={{ fontSize: '17px', flexGrow: 1, cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${artist._id}`)}
            >
              {artist.name}
            </span>
            <Button
              variant="primary"
              onClick={() => handleFollow(artist._id)}
              disabled={artist.isFollowRequested}
            >
              {artist.isFollowed ? 'Following' : (artist.isFollowRequested ? 'Requested' : 'Follow')}
            </Button>
          </Card.Body>
        </Card>
      ))}
    </>
  )
};

export default ArtistsList;
