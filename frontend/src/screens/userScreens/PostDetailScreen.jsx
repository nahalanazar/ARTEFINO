import { useState, useEffect } from "react"
import '../../styles/productDetails.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams, useNavigate } from "react-router-dom";
import { useGetPostByIdMutation } from "../../slices/userApiSlice";
import Map from '../../components/userComponents/Map'
import { useSelector } from 'react-redux';
import ChatButton from "../../components/userComponents/ChatButton";
import {toast} from 'react-toastify'
const PostDetailScreen = () => {
    const { userInfo } = useSelector((state) => state.userAuth);
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
    const VITE_PRODUCT_IMAGE_DIR_PATH = import.meta.env.VITE_PRODUCT_IMAGE_DIR_PATH;
    const { postId } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [post, setPost] = useState({});
    const [getPostById] = useGetPostByIdMutation();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await getPostById(postId);
                
                setPost(response.data);
                console.log("res:", response);
                
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
            <>
                <button className="edit-removeButton" onClick={() => editPost()}>
                    Edit Post
                </button>
                <button className="edit-removeButton removeButton" onClick={() => removePost()}>
                    Remove
                </button>
            </>
        );
    } else {
        return <></>; // No action button for other artists
    }
};


    return (
        <Container>
            <Row>
                {post && post.images && (
                    <Col sm={8}>
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
                            <div className="small-images">
                                {post.images &&
                                    post.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`${VITE_PRODUCT_IMAGE_DIR_PATH}${image}`}
                                            alt={`Small ${index}`}
                                            onClick={() => handleImageClick(index)}
                                            className={index === selectedImage ? 'selected' : ''}
                                        />
                                    ))}
                            </div>
                        </div>
                    </Col>
                )}
                {post && post?.stores && (
                    <Col sm={4}>
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
        </Container>
    );
};

export default PostDetailScreen
