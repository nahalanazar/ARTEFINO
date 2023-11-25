import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { useGetArtistsMutation, useFollowArtistMutation } from '../../slices/userApiSlice';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ArtistsList = () => {
  const [getArtists] = useGetArtistsMutation();
  const [artists, setArtists] = useState([]);
  const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
  const [followArtist] = useFollowArtistMutation();
  const navigate = useNavigate()
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await getArtists();
        console.log("response.data: ", response.data);
        setArtists(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchArtists();
  }, [getArtists]);

  const handleFollow = async (userIdToFollow) => {
    try {
      const artistId = String(userIdToFollow);
      const response = await followArtist(artistId);

      if (response.data.status === 'success') {
        toast.success("Started Following New Artist");

        // Update the local state to mark the artist as followed
        setArtists(prevArtists => {
          return prevArtists.map(artist =>
            artist._id === userIdToFollow
              ? { ...artist, isFollowed: true }
              : artist
          );
        });
      } else {
        console.error('Error following user:', response);
        toast.error("Failed to follow artist");
      }
    } catch (err) {
      console.error('Error following user:', err);
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <>
      <h6>Suggested Artists</h6>
      {artists.map((artist) => (
        <Card key={artist._id} style={{ width: '17rem', marginBottom: '20px' }}>
          <Card.Body style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={artist.profileImageName ? VITE_PROFILE_IMAGE_DIR_PATH + artist.profileImageName : VITE_PROFILE_IMAGE_DIR_PATH + 'defaultImage.jpeg'}
              alt="Profile"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '10px',
                objectFit: 'cover',
              }}
              onClick={() => navigate(`/profile/${artist._id}`)}
            />
            <span
              style={{ fontSize: '17px', flexGrow: 1 }}
              onClick={() => navigate(`/profile/${artist._id}`)}
            >
              {artist.name}
            </span>
            <Button
              variant="primary"
              onClick={() => handleFollow(artist._id)}
              disabled={artist.isFollowed} // Disable the button if already followed
            >
              {artist.isFollowed ? 'Following' : 'Follow'}
            </Button>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default ArtistsList;
