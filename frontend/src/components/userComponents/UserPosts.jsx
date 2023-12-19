import { useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import '../../styles/userPosts.css'
import { useGetUserPostsMutation } from '../../slices/userApiSlice'
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";

const UserPosts = () => {
    const VITE_PRODUCT_IMAGE_DIR_PATH = import.meta.env.VITE_PRODUCT_IMAGE_DIR_PATH;
    const { userInfo } = useSelector((state) => state.userAuth);
    const { id } = useParams()
    const [getUserPosts, { data, isLoading }] = useGetUserPostsMutation()
    const navigate = useNavigate();
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const userIdToFetch = String(id || userInfo.id);
          await getUserPosts(userIdToFetch);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };

      if (userInfo) {
        fetchPosts();
      }
    }, [id, userInfo, getUserPosts]);

    const handlePostClick = (postId) => {
        navigate(`/postDetails/${postId}`);
    };
    
  return (
    <div className="user-posts-container">
      {isLoading && <p>Loading posts...</p>}
      {data && Array.isArray(data.userPosts) && data.userPosts.length > 0 ? (
        data.userPosts.map((post) => (
          <Card key={post._id} className="user-post-card">
            {post.isRemoved ? (
              <div className="removed-post-message text-center">
                Post removed by admin
              </div>
            ) : (
              <>
                <Card.Img
                  variant="top"
                  src={`${VITE_PRODUCT_IMAGE_DIR_PATH}${post.images[0]}`}
                  onClick={() => handlePostClick(post._id)}
                />
                <Card.Body>
                  <Card.Title style={{ cursor: 'pointer' }} onClick={() => handlePostClick(post._id)}>
                    {post.title}
                  </Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  {/* <Button variant="primary">Go somewhere</Button> */}
                </Card.Body>
              </>
            )}
          </Card>
        ))
      ) : (
        <p className="center-message">No posts available.</p>
      )}
    </div>
  )
}

export default UserPosts;
