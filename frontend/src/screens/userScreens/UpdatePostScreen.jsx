import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify';
import Loader from "../../components/Loader";
import { useGetPostByIdMutation, useUpdatePostMutation, useGetCategoriesMutation } from '../../slices/userApiSlice';
import ConfirmationDialog from "../../components/userComponents/RemovePostConfirm";
import { ChakraProvider } from "@chakra-ui/react";

const UpdatePostScreen = () => {
    const { postId } = useParams();
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [images, setImages] = useState([]);
    const [accessLatitude, setAccessLatitude] = useState('');
    const [accessLongitude, setAccessLongitude] = useState('');
    const [address, setAddress] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageToRemoveIndex, setImageToRemoveIndex] = useState(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const navigate = useNavigate()

    const [getPostById] = useGetPostByIdMutation();
    const [updatePost] = useUpdatePostMutation();
    const [getCategories] = useGetCategoriesMutation();
    // const VITE_PRODUCT_IMAGE_DIR_PATH = import.meta.env.VITE_PRODUCT_IMAGE_DIR_PATH;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postResponse, categoriesResponse] = await Promise.all([
                    getPostById(postId),
                    getCategories(),
                ]);

                const postDetails = postResponse.data;
                setTitle(postDetails.title);
                setDescription(postDetails.description);
                setCategoryId(postDetails.category._id); // Assuming category field in postDetails
                setImages(postDetails.images);
                setAccessLatitude(postDetails.latitude);
                setAccessLongitude(postDetails.longitude);
                setAddress(postDetails.address);
                setCategories(categoriesResponse.data.categoryData);
                setImagePreviews(postDetails.images.map(image =>  image ));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
       
    }, [getCategories, getPostById, postId]);
   
    const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const isValidImage = files.every((file) => file.type.startsWith('image/'));

    if (!isValidImage) {
        toast.error('Please upload only image files.');
        return;
    }

    const newImagePreviews = files.map((file) => URL.createObjectURL(file));

    setImagePreviews((existingPreviews) => [...existingPreviews, ...newImagePreviews]);

    files.forEach((file) => {
        if (file instanceof File) {
            // Handle newly added images
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = () => {
                setImages((existingImages) => [...existingImages, { url: reader.result, isCloudinary: false }]);
            };
        } else if (typeof file === 'string') {
            // Handle existing Cloudinary images
            setImages((existingImages) => [...existingImages, { url: file, isCloudinary: true }]);
        }
    });
};


    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setCategoryId(selectedCategoryId);
    };

    const handleRemoveImage = (index) => {
        setImageToRemoveIndex(index);
        setShowConfirmationDialog(true);
    };

    const confirmRemoveImage = () => {
        setImages((existingImages) => {
            const updatedImages = [...existingImages];
            updatedImages.splice(imageToRemoveIndex, 1);
            return updatedImages;
        });

        setImagePreviews((existingPreviews) => {
            const updatedPreviews = [...existingPreviews];
            updatedPreviews.splice(imageToRemoveIndex, 1);
            return updatedPreviews;
        });

        setImageToRemoveIndex(null);
        setShowConfirmationDialog(false);
    };

    const cancelRemoveImage = () => {
        setImageToRemoveIndex(null);
        setShowConfirmationDialog(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !categoryId || images.length === 0) {
            toast.error('Please fill out all required fields.');
            return;
        }

        if (images.length > 3) {
            toast.error('You can upload up to 3 images.');
            return;
        }

        const postData = {
            title,
            description,
            category: categoryId,
            images: images.map((image) => ({
                url: image.url,
                isCloudinary: image.isCloudinary,
                isNew: !image.isCloudinary, // Flag to indicate new images
            })),
            latitude: accessLatitude,
            longitude: accessLongitude,
            address,
        };

        try {
            setLoading(true)
            const response = await updatePost({ postId, postData }).unwrap();
            if (response.error) {
                setLoading(false)
                toast.error(response.error.data.message);
            } else {
                setLoading(false)
                toast.success('Post Updated successfully');
            }
            navigate(`/postDetails/${response.postId}`);
        } catch (error) {
            setLoading(false)
            toast.error(error.data.message)
            console.error('Error updating post:', error);
        }
    };

  return (
    <ChakraProvider>
        <div>
      <FormContainer>
        <h1>Update Post</h1>
          
        <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='title'>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                ></Form.Control>
            </Form.Group>
              
            <Form.Group className='my-2' controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                    as="select"
                    value={categoryId}
                    onChange={handleCategoryChange}
                >
                    {/* Populate categories dynamically */}
                    {categories.map((categoryOption) => (
                    <option key={categoryOption._id} value={categoryOption._id}>
                        {categoryOption.name}
                    </option>
                    ))}
                </Form.Control>
            </Form.Group> 
              
            <Form.Group className='my-2' controlId="images">
                <Form.Label>Uploaded Images</Form.Label>
                <Row className="mt-3">
                    {imagePreviews.map((preview, index) => (
                        <Col key={index} xs={4} className="mb-3">
                            {preview.url ? (
                                <div>
                                    <img
                                        src={preview.url}
                                        alt={`Preview ${index + 1}`}
                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={preview}
                                        alt={`New Preview ${index + 1}`}
                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </Col>
                    ))}
                </Row>
                {showConfirmationDialog && (
                    <ConfirmationDialog
                        onConfirm={confirmRemoveImage}
                        onCancel={cancelRemoveImage}
                    />
                )}
                <Form.Control className="mt-5" type="file" multiple name="images" onChange={handleImageChange} />
            </Form.Group>

              
            <Form.Group controlId="latitude">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="Latitude"
                    value={accessLatitude}
                    onChange={(e)=>setAccessLatitude(e.target.value)}
                />
            </Form.Group>
            
            <Form.Group controlId="longitude">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="Longitude"
                    value={accessLongitude}
                    onChange={(e)=>setAccessLongitude(e.target.value)}
                />
            </Form.Group>      
            
            <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="Add Your Address"
                    value={address}
                    onChange={(e)=>setAddress(e.target.value)}
                />
            </Form.Group>     

            {loading && <Loader />}      

            <Button type='submit' variant='primary' className='mt-3' disabled={loading}>
                {loading ? "Updating..." : "Update"}
            </Button>  
        </Form>  
    </FormContainer>
    </div>
    </ChakraProvider>
  )
}

export default UpdatePostScreen
