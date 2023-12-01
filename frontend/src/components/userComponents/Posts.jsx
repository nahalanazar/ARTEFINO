import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FaThumbsUp, FaComment } from 'react-icons/fa';
import { useShowPostsMutation } from '../../slices/userApiSlice';
import { useNavigate } from 'react-router-dom';

const Posts = () => {
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH
    const VITE_PRODUCT_IMAGE_DIR_PATH = import.meta.env.VITE_PRODUCT_IMAGE_DIR_PATH
    const [posts, setPosts] = useState([]);
    const [getPosts] = useShowPostsMutation();
    const [isLiked, setIsLiked] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
        try {
            const response = await getPosts();
            console.log("response.data: ", response.data)
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        };

        fetchPosts();
    }, [getPosts]);

    const handleLikeClick = (event) => {
        event.stopPropagation(); // Prevent the event from propagating to the parent (Card) click handler
        setIsLiked((prevIsLiked) => !prevIsLiked);
    };

    const handleCommentClick = (event) => {
        event.stopPropagation(); // Prevent the event from propagating to the parent (Card) click handler
        // Add logic for handling comment click
    };

    const handlePostClick = (postId) => {
        navigate(`/postDetails/${postId}`);
    };
    
    return (
        <div>
        {posts?.map((post) => (
            <Card key={post._id} style={{ marginBottom: '20px' }}>
            <Card.Header>
                <img
                    src={`${VITE_PROFILE_IMAGE_DIR_PATH}${post.stores.profileImageName}`}
                    alt="Profile"
                    style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        marginRight: '10px',
                        objectFit: 'cover',
                    }}
                />
                {post.stores.name}
            </Card.Header>
            <Card.Img
                variant="top"
                src={`${VITE_PRODUCT_IMAGE_DIR_PATH}${post.images[0]}`}
                style={{ objectFit: 'cover', height: '400px', cursor: 'pointer' }} 
                onClick={() => handlePostClick(post._id)} 
                />
            <Card.Body>
                <Card.Title
                    style={{ cursor: 'pointer' }}
                    onClick={() => handlePostClick(post._id)}
                >
                    {post.title}
                    <span style={{ float: 'right' }}>
                        <button
                            onClick={(event) => handleLikeClick(event)}
                            style={{
                                cursor: 'pointer',
                                padding: '5px',
                                display: 'inline-block',
                                border: 'none',
                                background: 'none',
                            }}
                        >
                            <FaThumbsUp style={{ color: isLiked ? 'blue' : '' }} /> {post.likes.length}{' '}
                        </button>
                        <button
                            onClick={(event) => handleCommentClick(event)}
                            style={{
                                cursor: 'pointer',
                                padding: '5px',
                                display: 'inline-block',
                                border: 'none',
                                background: 'none',
                            }}
                        >
                            <FaComment style={{ marginRight: '5px' }} /> {post.comments.length}
                        </button>
                    </span>
                </Card.Title>
                <Card.Text>{post.description}</Card.Text>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">Uploaded on {new Date(post.dateListed).toLocaleDateString()}</small>
                <br />
                <small className="text-muted">Category: {post.category.name}</small>
            </Card.Footer>
            </Card>
        ))}
        </div>
    )
   
};

export default Posts;
