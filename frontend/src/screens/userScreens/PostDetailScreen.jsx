import { Button, ChakraProvider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import '../../styles/productDetails.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams, useNavigate } from "react-router-dom";
import { useGetPostByIdMutation, useRemovePostMutation } from "../../slices/userApiSlice";
import Map from '../../components/userComponents/Map'
import { useSelector } from 'react-redux';
import ChatButton from "../../components/userComponents/ChatButton";
import { toast } from 'react-toastify'
import ConfirmationDialog from "../../components/userComponents/RemovePostConfirm";

const PostDetailScreen = () => {
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
    const VITE_PRODUCT_IMAGE_DIR_PATH = import.meta.env.VITE_PRODUCT_IMAGE_DIR_PATH;
    const { userInfo } = useSelector((state) => state.userAuth);
    const { postId } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [confirmation, setConfirmation] = useState(false);
    const [post, setPost] = useState({});
    const [postToRemove, setPostToRemove] = useState(null);
    const navigate = useNavigate()

    const [getPostById] = useGetPostByIdMutation();
    const [removePost] = useRemovePostMutation();

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await getPostById(postId);
                setPost(response.data);                
            } catch (error) {
                console.error("Error fetching post details:", error);
                toast.error(error.data.message);
            }
        };

        fetchPostDetails();
    }, [postId, getPostById]);

    const handleImageClick = (index) => {
        setSelectedImage(index);
    }

    const handleArrowClick = (direction) => {
        const newIndex =
            direction === 'next'
                ? (selectedImage + 1) % (post?.images?.length || 1)
                : (selectedImage - 1 + (post?.images?.length || 1)) % (post?.images?.length || 1);

        setSelectedImage(newIndex);
    };

    const isCurrentUserPost = post?.stores && post?.stores._id === userInfo.id;

    
    const renderProfileLink = () => {
        const commonStyles = {
            profileImage: {
                src: `${VITE_PROFILE_IMAGE_DIR_PATH}${post?.stores.profileImageName}`,
                alt: 'Profile',
            },
            artistName: post?.stores.name,
        };

        if (isCurrentUserPost) {
            return (
                <div className="artist-info" onClick={() => navigate('/profile')}>
                    <img {...commonStyles.profileImage} />
                    <h3>{commonStyles.artistName}</h3>
                </div>
            );
        } else {
            return (
                <div className="artist-info">
                    <img {...commonStyles.profileImage}  onClick={() => navigate(`/profile/${post?.stores._id}`)}/>
                    <h3 style={{ marginRight: "60px" }} onClick={() => navigate(`/profile/${post?.stores._id}`)}>{commonStyles.artistName}</h3>
                    <ChatButton userId={post?.stores._id} />
                </div>
            );
        }
    };

    
    const renderActionButton = () => {
        if (isCurrentUserPost) {
            return (
                <div className="button-container">
                    <button className="edit-removeButton" onClick={() => handleUpdatePost(post._id)}>
                        Edit Post
                    </button>
                    <Button className="edit-removeButton removeButton" colorScheme="red" onClick={() => handleRemovePost(post._id)}>
                        Remove
                    </Button>
                </div>
            );
        } else {
            return <></>; // No action button for other artists
        }
    };

    const handleRemovePost = async (postId) => {
        setPostToRemove(postId);
        setConfirmation(true);
    };

    const handleConfirmation = async () => {
        try {
            const artistId = String(postToRemove);
            const response = await removePost(artistId);
            
            if (response.data.status === "success") {
                toast.warning("Post removed successfully");
                navigate('/');
            } else {
                console.error("Error Removing Post: ", response);
                toast.error("Failed to Remove Post");
            }

        } catch (error) {
            console.error("Error removing post:", error);
            toast.error(error?.data?.message || "Failed to remove post");
        } finally {
            setConfirmation(false);
            setPostToRemove(null);
        }
    };

    const handleCancelConfirmation = () => {
        setConfirmation(false);
        setPostToRemove(null);
    };

    const handleUpdatePost = (postId) => {
        navigate(`/updatePost/${postId}`);
    };

    return (
        <ChakraProvider>
            <Container>
                <Row>
                    {post && post.images && (
                        <Col md={8}>
                            <div className="image-section pt-5">
                                <div className="large-image-container">
                                    <img
                                        src={`${VITE_PRODUCT_IMAGE_DIR_PATH}${post.images[selectedImage]}`}
                                        alt="Large"
                                        className="large-image"
                                    />
                                    <div className="arrow-icons">
                                        <FaArrowLeft onClick={() => handleArrowClick('prev')} />
                                        <FaArrowRight onClick={() => handleArrowClick('next')} />
                                    </div>
                                </div>
                                <div className="small-images d-flex">
                                    {post.images &&
                                        post.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={`${VITE_PRODUCT_IMAGE_DIR_PATH}${image}`}
                                                alt={`Small ${index}`}
                                                onClick={() => handleImageClick(index)}
                                                className={index === selectedImage ? 'selected' : ''} // Adding margins between images on large screens
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </Col>
                    )}
                    {post && post?.stores && (
                        <Col md={4}>
                            <div className="details-section pt-5">
                                <div className="product-details-box mb-3">
                                    <h2>{post.title}</h2>
                                    <p>{post.description}</p>
                                </div>
                                <div className="artist-details-box mb-3">
                                    <div>
                                        {renderProfileLink()}
                                    </div>
                                    <div className="rem-editButton">
                                        {renderActionButton()}
                                    </div>
                                </div>
                                <div className="location-box mb-3">
                                    <h5>Posted from:</h5>
                                    <div className="address-info">
                                        <p>{post.address}</p>
                                    </div>
                                    <div className="map-container">
                                        {post.latitude && post.longitude ? (
                                            <Map
                                                latitude={post.latitude}
                                                longitude={post.longitude}
                                            />
                                        ) : (
                                            <p>Location not provided</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
                {confirmation && (
                    <ConfirmationDialog
                        onConfirm={handleConfirmation}
                        onCancel={handleCancelConfirmation}
                    />
                )}
            </Container>
        </ChakraProvider>
    );
};

export default PostDetailScreen;
