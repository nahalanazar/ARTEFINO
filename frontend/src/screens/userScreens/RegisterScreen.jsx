import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { useRegisterMutation, useGoogleRegisterMutation } from '../../slices/userApiSlice'
import { setCredentials } from '../../slices/userAuthSlice'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userInfo } = useSelector((state) => state.userAuth)
    const [register, { isLoading }] = useRegisterMutation()
    const [googleRegister] = useGoogleRegisterMutation()

    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
        } else {
            try {
                const res = await register({ name, mobile, email, password }).unwrap()
                console.log("res", res)
                if (res.message) {
                    navigate('/otpVerify')
                } else {
                    toast.error(res.error.data.message);
                }
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }
    const googleSubmit = async (decoded) => {
        try {
            const name = decoded.given_name
            const email = decoded.email

            const res = await googleRegister({ name, email }).unwrap()
            dispatch(setCredentials({ ...res }))
            navigate('/')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
  return (
    <FormContainer>
        <h1>Sign Up</h1>

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
              
            <Form.Group className='my-2' controlId='mobile'>
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter Mobile'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
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
              
            {isLoading && <Loader />}

            <Button type='submit' variant='primary' className='mt-3'>
                  Send OTP
            </Button>

            <Row className='py-3'>
                <Col>
                    Already have an account? <Link to='/login'>Login</Link>
                </Col> 
            </Row>  
            <GoogleOAuthProvider clientId="915783098784-vqrg4q9jh52kbfrh7u085shb3u4tqk45.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={credentialResponse => {
                    const decoded = jwtDecode(credentialResponse.credential);
                    console.log(decoded);
                    {googleSubmit(decoded)}
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
                />
            </GoogleOAuthProvider>
        </Form>  
    </FormContainer>
  )
}

export default RegisterScreen
