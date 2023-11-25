import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import FormContainer from '../../components/FormContainer';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useAddProductMutation, useGetCategoriesMutation } from '../../slices/userApiSlice';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const SellScreen = () => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [getCategories] = useGetCategoriesMutation();
  // const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [accessLatitude, setAccessLatitude] = useState('');
  const [accessLongitude, setAccessLongitude] = useState('');
  const [address, setAddress] = useState('');

  const navigate = useNavigate()

   useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          console.log(result);
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
    const files = e.target.files;
    const previews = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(Array.from(files)); // Convert files to an array
    setImagePreviews(previews);
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);
    const selectedCategory = categories.find((cat) => cat._id === selectedCategoryId);
    console.log("selectedCategory: ", selectedCategory);
  };

  // const handleMapClick = (e) => {
  //   setLocation({ lat: e.latlng.lat, lon: e.latlng.lng });
  // };

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

    for (let i = 0; i < images.length; i++) {
      const fileType = images[i].type.split('/')[0];
      if (fileType !== 'image') {
        toast.error('Please upload only images (JPEG, PNG, etc.).');
        return;
      }
    }

    try {
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

      const response = await addProduct(formData).unwrap();
      console.log("response: ", response);
      toast.success('Product added successfully');
      navigate('/')
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.data.error.message);
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
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
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
            // onChange={(e) => setCategoryId(e.target.value)}
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

        {/* <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <MapContainer
            center={[location.lat, location.lon]}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
            onClick={handleMapClick}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {location.lat !== 0 && location.lon !== 0 && (
              <Marker position={[location.lat, location.lon]}>
                <Popup>Your selected location</Popup>
              </Marker>
            )}
          </MapContainer>
        </Form.Group> */}

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

        {isLoading && <Loader />}

        <Button type="submit" variant="primary" className="mt-3">
          Add Product
        </Button>
      </Form>
    </FormContainer>
  )
}

export default SellScreen
