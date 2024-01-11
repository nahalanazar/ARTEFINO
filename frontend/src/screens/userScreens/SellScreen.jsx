import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import FormContainer from '../../components/FormContainer';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useAddProductMutation, useGetCategoriesMutation } from '../../slices/userApiSlice';


const SellScreen = () => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [addProduct] = useAddProductMutation();
  const [getCategories] = useGetCategoriesMutation();
  const [accessLatitude, setAccessLatitude] = useState('');
  const [accessLongitude, setAccessLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

   useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
   }, []);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const categoryData = response.data.categoryData;
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(file => URL.createObjectURL(file));
    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].type.split('/')[0];
      if (fileType !== 'image') {
        toast.error('Please upload only images (JPEG, PNG, etc.).');
        setImagePreviews([])
        setImages([])
        e.target.value = null;
        return;
      }
    }
    if (files.length > 3) {
      toast.error('You can upload up to 3 images.');
      e.target.value = null;
      setImagePreviews([])
      setImages([])
      return;
    }
    files.forEach(file => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setImages(oldArray => [...oldArray, reader.result])
      }
    })

    setImagePreviews(previews);
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !categoryId || images.length === 0) {
      toast.error('Please fill out all required fields.');
      return;
    }

    if (images.length > 3) {
      toast.error('You can upload up to 3 images.');
      return;
    }

    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', categoryId);
      images.forEach((image, index) => {
        formData.append('images', image);
      });
      formData.append('latitude', accessLatitude);
      formData.append('longitude', accessLongitude);
      formData.append('address', address)
      // const response = await addProduct(formData).unwrap();
      const response = await addProduct({title, description, categoryId, images, accessLatitude, accessLongitude, address}).unwrap();
      if (response) {
        setLoading(false)
        setImages([])
        toast.success('Product added successfully');
        navigate(`/postDetails/${response.postId}`)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error adding product:', error);
      toast.error(error.data.error);
    }
  };

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;
    console.log("Your current position is:", crd);
    setAccessLatitude(crd.latitude)
    setAccessLongitude(crd.longitude)
  }
 
  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
 

  return (
    <FormContainer>
      <h1>Sell Your Art</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={categoryId}
            onChange={handleCategoryChange}
          >
            {/* Populate categories dynamically */}
            <option value="">Select category</option>
            {categories.map((categoryOption) => (
              <option key={categoryOption._id} value={categoryOption._id}>
                {categoryOption.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="images">
          <Form.Label>Upload Images</Form.Label>
          <Form.Control type="file" multiple name="images" onChange={handleImageChange} />
          <Row className="mt-3">
            {imagePreviews.map((preview, index) => (
              <Col key={index} xs={4} className="mb-3">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{ width: '100%', height: '100%' }}
                />
              </Col>
            ))}
          </Row>
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

        <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
          {loading ? "Uploading..." : "Add Product"}
        </Button>
      </Form>
    </FormContainer>
  )
}

export default SellScreen
