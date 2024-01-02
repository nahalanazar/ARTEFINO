import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';
import { useGetArtistsMutation } from '../../slices/userApiSlice';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import FollowButton from './FollowButton';

const ArtistsList = () => {
  const { userInfo } = useSelector((state) => state.userAuth);
  const [getArtists] = useGetArtistsMutation();
  const [artists, setArtists] = useState([]);
  const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
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

  const handleFollowChange = (artistId, isFollowed) => {
    setArtists((prevArtists) =>
      prevArtists.map((artist) =>
        artist._id === artistId
          ? { ...artist, isFollowed, isFollowRequested: false }
          : artist
      )
    );
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
            <FollowButton artistId={artist._id} onFollowChange={(isFollowed) => handleFollowChange(artist._id, isFollowed)} />
          </Card.Body>
        </Card>
      ))}
    </>
  )
};

export default ArtistsList;
