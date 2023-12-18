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
    const [isLoading, setIsLoading] = useState(false);
    const [imageToRemoveIndex, setImageToRemoveIndex] = useState(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const navigate = useNavigate()

    const [getPostById] = useGetPostByIdMutation();
    const [updatePost, { postLoading }] = useUpdatePostMutation();
    const [getCategories] = useGetCategoriesMutation();
    const VITE_PRODUCT_IMAGE_DIR_PATH = import.meta.env.VITE_PRODUCT_IMAGE_DIR_PATH;

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
                setImagePreviews(postDetails.images.map(image => `${VITE_PRODUCT_IMAGE_DIR_PATH}${image}`));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
       
    }, [getCategories, getPostById, postId]);

    const handleImageChange = (e) => {
        const files = e.target.files;
        const newImages = Array.from(files);
        const newImagePreviews = Array.from(files).map(file => URL.createObjectURL(file));

        setImages(existingImages => [...existingImages, ...newImages]);
        setImagePreviews(existingPreviews => [...existingPreviews, ...newImagePreviews]);
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setCategoryId(selectedCategoryId);
    };

    // const handleRemoveImage = (index) => {
    //     setImages((existingImages) => {
    //         const updatedImages = [...existingImages];
    //         updatedImages.splice(index, 1);
    //         return updatedImages;
    //     });

    //     setImagePreviews((existingPreviews) => {
    //         const updatedPreviews = [...existingPreviews];
    //         updatedPreviews.splice(index, 1);
    //         return updatedPreviews;
    //     });
    // };

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

        for (let i = 0; i < images.length; i++) {
            const fileType = typeof images[i] === 'object' ? images[i].type.split('/')[0] : null;

            // If it's not an object, assume it's a URL (string) and continue
            if (fileType && fileType !== 'image') {
                toast.error('Please upload only images (JPEG, PNG, etc.).');
                return;
            }
        }

        // Create form data and update the post
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', categoryId);

        if(images.length > 0){
            images.forEach((image, index) => {
                if (index < imagePreviews.length) {
                    // Existing image details
                    if (typeof image === 'string') {
                        // URL string (existing image)
                        formData.append('existingImages', image);
                    } else {
                        // File object (newly added image)
                        formData.append('images', image);
                    }
                } else {
                    // Newly added images
                    formData.append('images', image);
                }
            });
        }
        
        formData.append('latitude', accessLatitude);
        formData.append('longitude', accessLongitude);
        formData.append('address', address);

        try {
            const response = await updatePost({ postId, formData } ).unwrap();
            console.log("response from update post: ", response);
            if (response.error) {
                toast.error(response.error.data.message)
            } else {          
                toast.success('Post Updated successfully');
            }
            navigate(`/postDetails/${response.postId}`)
        } catch (error) {
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
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                style={{ width: '100%', height: '100%' }}
                            />
                            <Button 
                                variant="danger"
                                size="sm"
                                className="mt-2"
                                onClick={() => handleRemoveImage(index)}
                            >
                                Remove
                            </Button>
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

            {postLoading && <Loader />}      

            <Button type='submit' variant='primary' className='mt-3'>
                Update
            </Button>  
        </Form>  
    </FormContainer>
    </div>
    </ChakraProvider>
  )
}

export default UpdatePostScreen
