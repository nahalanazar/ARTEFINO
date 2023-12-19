import { Button, ChakraProvider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import '../../styles/productDetails.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams, useNavigate } from "react-router-dom";
import { useGetPostByIdMutation, useRemovePostMutation, useReportPostMutation } from "../../slices/userApiSlice";
import Map from '../../components/userComponents/Map'
import { useSelector } from 'react-redux';
import ChatButton from "../../components/userComponents/ChatButton";
import { toast } from 'react-toastify'
import ConfirmationDialog from "../../components/userComponents/RemovePostConfirm";
import ReportModal from "../../components/userComponents/ReportModal";

const PostDetailScreen = () => {
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
    const VITE_PRODUCT_IMAGE_DIR_PATH = import.meta.env.VITE_PRODUCT_IMAGE_DIR_PATH;

    const { userInfo } = useSelector((state) => state.userAuth);
    const { postId } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [confirmation, setConfirmation] = useState(false);
    const [post, setPost] = useState({});
    const [postToRemove, setPostToRemove] = useState(null);
    const [postToReport, setPostToReport] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isReported, setIsReported] = useState(false);

    const imageUrl = post?.stores?.profileImageName ? VITE_PROFILE_IMAGE_DIR_PATH + post.stores.profileImageName : VITE_PROFILE_IMAGE_DIR_PATH + 'defaultImage.jpeg';
    const navigate = useNavigate()

    const [getPostById] = useGetPostByIdMutation();
    const [removePost] = useRemovePostMutation();
    const [reportPost] = useReportPostMutation();

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await getPostById(postId);
                console.log("response post details:", response);
                setPost(response.data);
                const userReported = response.data.reports.some(report => report.reporter === userInfo.id);
                setIsReported(userReported);
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
                src: imageUrl,
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
            return (
                <div className="button-container text-center">
                    <ChatButton userId={post?.stores._id} />
                    <button className="followButton removeButton"
                        style={{
                            color: 'white',  
                            backgroundColor: 'red',  
                            fontSize: 16,
                            fontFamily: 'Roboto',
                            fontWeight: '700',
                            padding: '8px 16px',  
                            border: 'none',  
                            borderRadius: '4px',  
                            cursor: 'pointer',
                        }} onClick={() => (isReported ? null : handleReportModal(post._id))}
                    >
                        {isReported ? 'Reported' : 'Report'}
                    </button>
                </div>
            );
        }
    };

    const handleReportModal = async (postId) => {
        setShowReportModal(true);
        setPostToReport(postId);
        console.log("setPostToReport", setPostToReport);
    }

    const handleReport = async (postId, reportDetails) => {
        try {
            if (!postId) {
                console.error("postId is not available");
                return;
            }
          
            const response = await reportPost({ postId, data: reportDetails });
console.log("response", response);
            if (response.data.message === "Report submitted successfully") {
                toast.success("Post reported successfully!");
                setShowReportModal(false);
                setIsReported(true)
            } else {
                console.error("Error reporting post:", response);
                toast.error("Failed to report post");
            }
            setPostToReport(null);
        } catch (error) {
            console.error("Error reporting post:", error);
            toast.error("Failed to report post");
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
            {showReportModal && (
                <ReportModal
                    showModal={showReportModal}
                    handleClose={() => {
                        setShowReportModal(false);
                    }}
                    handleReport={handleReport}
                    postToReport={postToReport}
                />
            )}
        </ChakraProvider>
    );
};

export default PostDetailScreen;
