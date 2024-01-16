import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { setCredentials } from '../../slices/userAuthSlice'
import { useUpdateUserMutation } from '../../slices/userApiSlice'

const UpdateProfileScreen = () => {
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
    const { userInfo } = useSelector((state) => state.userAuth)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [profileImage, setProfileImage] = useState('');
    const [isPrivate, setIsPrivate] = useState(userInfo.isPrivate);

    const dispatch = useDispatch()

    const [updateProfile, {isLoading}] = useUpdateUserMutation()
    
    useEffect(() => {
        setName(userInfo.name)
       setEmail(userInfo.email) 
    }, [userInfo.name, userInfo.email])

    // handle and convert it in base 64
    const handleImage = (e) => {
        const file = e.target.files[0]
        setFileToBase(file)
    }

    const setFileToBase = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setProfileImage(reader.result)
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
        } else {
            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('profileImage', profileImage);
                formData.append('isPrivate', isPrivate);
                const responseFromApiCall = await updateProfile({name,email,password,profileImage,isPrivate}).unwrap();
                if (responseFromApiCall) {      
                    dispatch( setCredentials( { ...responseFromApiCall } ) );
                    toast.success('Profile updated')
               }
            } catch (err) {
                console.log("blocked", err?.data?.error?.message)
                toast.error(err?.data?.message || err.error || err?.data?.error?.message)
            }
        }
    }
  return (
    <FormContainer>
        <h1>Update Profile</h1>

            <img
            src={userInfo.profileImageName ? userInfo.profileImageName : VITE_PROFILE_IMAGE_DIR_PATH}
            alt={userInfo.name}
            style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                marginTop: "5px",
                marginLeft: "115px",
                marginBottom: "10px",
            }}                      
            />
        
          
        <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                ></Form.Control>
            </Form.Group>
              
            <Form.Group className='my-2' controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                type='email'
                placeholder='Enter Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>  
              
            <Form.Group className='my-2' controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
              
            <Form.Group className="my-2" controlId="profileImage">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImage}
              ></Form.Control>
            </Form.Group>
            
            <Form.Group controlId='isPrivate' className='my-2'>
                <Form.Check
                    type='checkbox'
                    label='Make Account Private'
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
            </Form.Group>
            
            {isLoading && <Loader />}

            <Button type='submit' variant='primary' className='mt-3'>
                Update
            </Button>  
        </Form>  
    </FormContainer>
  )
}

export default UpdateProfileScreen
