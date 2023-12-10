import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FaThumbsUp, FaComment } from 'react-icons/fa';
import moment from 'moment';
import { useShowPostsMutation, useLikePostMutation, useUnlikePostMutation } from '../../slices/userApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Posts = () => {
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH
    const VITE_PRODUCT_IMAGE_DIR_PATH = import.meta.env.VITE_PRODUCT_IMAGE_DIR_PATH
    const { userInfo } = useSelector((state) => state.userAuth);
    const [posts, setPosts] = useState([]);
    const [getPosts] = useShowPostsMutation();
    const [likePost] = useLikePostMutation();
    const [unlikePostApi] = useUnlikePostMutation();
    const [isLiked, setIsLiked] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPosts();
                const postsData = response.data;
                console.log("postsData: ", postsData)
                setPosts(postsData);
                // Check if the current user has liked each post
                const likedPosts = postsData.map((post) => ({
                    ...post,
                    isLiked: userInfo ? post.likes.includes(userInfo.id) : false
                }));

                setPosts(likedPosts);
            } catch (error) {
                console.error('Error Getting posts:', error);
            }
        };

        fetchPosts();
    }, [getPosts, userInfo, isLiked]);

    const handleLikeClick = async (event, postId) => {
        event.stopPropagation(); // Prevent the event from propagating to the parent (Card) click handler
        if (!userInfo) {
            navigate('/login')
        }
        try {
            if (isLiked) {
                await unlikePost(postId)
            } else {
                const response = await likePost(postId).unwrap();
                console.log("response on like: ", response);
                // Update the likes count in the post
                const updatedPosts = posts.map((post) => {
                    if (post._id === postId) {
                        return { ...post, likes: response.likes };
                    }
                    return post;
                });

                setPosts(updatedPosts);
                setIsLiked(true);
            }
        } catch (error) {
            console.log("Error adding like:", error);
        }
    };

    const unlikePost = async (postId) => {
    try {
        const response = await unlikePostApi(postId).unwrap(); // Replace with your API call for unlike
        console.log("response on unlike: ", response);

        // Update the likes count in the post
        const updatedPosts = posts.map((post) => {
            if (post._id === postId) {
                return { ...post, likes: response.likes };
            }
            return post;
        });

        setPosts(updatedPosts);
        setIsLiked(false); // Set isLiked to false, as the user has unliked the post
    } catch (error) {
        console.log("Error removing like:", error);
    }
};


    const handleCommentClick = (event) => {
        event.stopPropagation(); // Prevent the event from propagating to the parent (Card) click handler
        if (!userInfo) {
            navigate('/login')
        }
    };

    const handlePostClick = (postId) => {
        navigate(`/postDetails/${postId}`);
    };

    // Function to format the time difference
    const formatTimeDifference = (timestamp) => {
        const now = moment();
        const postTime = moment(timestamp);

        const diffInMinutes = now.diff(postTime, 'minutes');
        const diffInHours = now.diff(postTime, 'hours');
        const diffInDays = now.diff(postTime, 'days');

        if (diffInMinutes < 60) {
            return `Updated ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffInHours < 24) {
            return `Updated ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffInDays < 7) {
            return `Updated ${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
        } else {
            return `Updated on ${postTime.format('MMMM DD, YYYY')}`;
        }
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
                <Card.Title >
                    {post.title}
                    <span style={{ float: 'right' }}>
                        <button
                            onClick={(event) => handleLikeClick(event, post._id)}
                            style={{
                                cursor: 'pointer',
                                padding: '5px',
                                border: 'none',
                                background: 'none',
                                display: 'inline-block'
                            }}
                        >
                            <FaThumbsUp style={{ color: post.isLiked ? 'blue' : '' }} /> 
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
                            <FaComment style={{ marginRight: '5px' }} />
                        </button>
                        {post.comments && <>{post.comments.length > 0 &&post.comments.length}</>}
                    </span>
                </Card.Title>
                <Card.Text>{post.description}</Card.Text>
                {post.likes && <>{post.likes.length > 0 && `${post.likes.length} ${post.likes.length === 1 ? 'like' : 'likes'}`}</>}
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">{formatTimeDifference(post.dateListed)}</small>
                {/* <small className="text-muted">Uploaded on {new Date(post.dateListed).toLocaleDateString()}</small> */}
                <br />
                <small className="text-muted">Category: {post.category.name}</small>
            </Card.Footer>
            </Card>
        ))}
        </div>
    )
   
};

export default Posts;
