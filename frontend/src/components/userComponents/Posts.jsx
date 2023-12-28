import { useDisclosure, ChakraProvider, useToast } from "@chakra-ui/react";
import Card from 'react-bootstrap/Card';
import { FaThumbsUp, FaComment } from 'react-icons/fa';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useShowPostsMutation, useShowLandingPostsMutation, useLikePostMutation, useUnlikePostMutation } from '../../slices/userApiSlice';
import CommentsModal from './CommentsModal';

const Posts = ({ selectedCategory }) => {
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH
    const VITE_PRODUCT_IMAGE_DIR_PATH = import.meta.env.VITE_PRODUCT_IMAGE_DIR_PATH
    const { userInfo } = useSelector((state) => state.userAuth);
    const [posts, setPosts] = useState([]);
    const [commentModalPost, setCommentModalPost] = useState(null);
    
    const { isOpen: isCommentsModalOpen, onOpen: onOpenCommentsModal, onClose: onCloseCommentsModal } = useDisclosure();
    const navigate = useNavigate();

    const [getPosts] = useShowPostsMutation();
    const [getLandingPosts] = useShowLandingPostsMutation();
    const [likePost] = useLikePostMutation();
    const [unlikePostApi] = useUnlikePostMutation();

    const toast = useToast();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPosts()
                const postsData = response.data;
                console.log("postsData", postsData);
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
        
        const fetchLandingPosts = async () => {
            try {
                const response = await getLandingPosts()
                console.log("response landing", response);
                const postsData = response.data;
                console.log("postsData", postsData);
                setPosts(postsData);

                // Check if the current user has liked each post
                const likedPosts = postsData.map((post) => ({
                    ...post,
                    isLiked: userInfo ? post.likes.includes(userInfo.id) : false
                }));

                setPosts(likedPosts);
            } catch (error) {
                console.error('Error Getting landing posts:', error);
            }
        };

        if (userInfo) {
            fetchPosts();
        } else {
            fetchLandingPosts()
        }
    }, [getPosts, getLandingPosts, userInfo]);
    
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

    const handleLikeClick = async (event, postId) => {
        event.stopPropagation(); // Prevent the event from propagating to the parent (Card) click handler
        if (!userInfo) {
            navigate('/login')
        }
        try {
            const response = posts.find((post) => post._id === postId).isLiked
                ? await unlikePostApi(postId).unwrap()
                : await likePost(postId).unwrap();
            console.log("response on like: ", response);

            // Update the likes count in the post
            const updatedPosts = posts.map((post) =>
                post._id === postId
                    ? { ...post, likes: response.likes, isLiked: !post.isLiked }
                    : post
            );

            setPosts(updatedPosts);

        } catch (error) {
            console.log("Error adding like:", error);
        }
    };

    const handleCommentClick = (event, postId) => {
        event.stopPropagation(); // Prevent the event from propagating to the parent (Card) click handler
        if (!userInfo) {
            navigate('/login')
        }
        // Find the post based on postId
        const post = posts.find((post) => post._id === postId);
        setCommentModalPost(post);
        onOpenCommentsModal();
    };

    const handlePostClick = (postId) => {
        navigate(`/postDetails/${postId}`);
    };
    
    const handleCommentPost = (postId, addedComment) => {
        const updatedPosts = posts.map((post) =>
            post._id === postId
                ? { ...post, comments: [...post.comments, addedComment] }
                : post
        );
        setPosts(updatedPosts);
        if (addedComment) {
        toast({
            title: "Comment Added",
            description: "Your comment has been added successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right"
        });
    }
    };

    const filteredPosts = selectedCategory && selectedCategory !== "ALL"
    ? posts.filter((post) => post.category.name === selectedCategory)
    : posts;
    
    return (
        <ChakraProvider>
            <div>
                {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                    <Card key={post._id} style={{ marginBottom: '20px' }}>
                            <Card.Header style={{ display: 'flex', alignItems: 'center' }}>
                                {post.stores && post.stores.name && (
                                    <>
                                        <img
                                            src={post?.stores?.profileImageName ? post.stores.profileImageName : VITE_PROFILE_IMAGE_DIR_PATH + 'defaultImage.jpeg'}
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
                                    </>
                                )}
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
                                            onClick={(event) => handleCommentClick(event, post._id)}
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
                                        {post.comments && <>{post.comments.length > 0 && post.comments.length}</>}
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
                ))
                ) : (
                <p>No posts to show.</p>
                )}
                <CommentsModal post={commentModalPost} isOpen={isCommentsModalOpen} onClose={onCloseCommentsModal} onCommentPost={handleCommentPost} formatTimeDifference={formatTimeDifference} setPosts={setPosts} posts={posts} />
            </div>
        </ChakraProvider>
    )
};

export default Posts;
