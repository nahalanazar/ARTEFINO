import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import { Form, Button, Row, Col } from 'react-bootstrap'
// import FormContainer from '../../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation, useGoogleRegisterMutation } from '../../slices/userApiSlice'
import { setCredentials } from '../../slices/userAuthSlice'
import {toast} from 'react-toastify'
import Loader from '../../components/Loader'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { loginValidateEmail, loginValidatePassword } from '../../components/userComponents/validation';

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()
    const [googleRegister] = useGoogleRegisterMutation()

    // to get user data:
    // ('userInfo' is the state)
    // state.auth: 'auth' is the part of the state, in which the userInfo is stored('auth' from store)
    const { userInfo } = useSelector((state) => state.userAuth)
    const VITE_REGISTER_IMAGE_DIR_PATH = import.meta.env.VITE_REGISTER_IMAGE_DIR_PATH
    
    // to redirect to home, if already logged in:
    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate Email
        const emailValidationResult = loginValidateEmail(email);
        setEmailError(emailValidationResult);

        // Validate Password
        const passwordValidationResult = loginValidatePassword(password);
        setPasswordError(passwordValidationResult);

        if (
            !emailValidationResult &&
            !passwordValidationResult
        ) {
            try {
                // making login POST request (/auth), pass email & password to backend, and assign its response to 'res'
                const responseFromApiCall = await login({ email, password }).unwrap() // 'unwrap' to unwrap the returned promise 
                console.log("responseFromApiCall", responseFromApiCall)
                if (responseFromApiCall) {
                    // then to store it in the local storage & state, setCredential is called and res is passed to it
                    dispatch(setCredentials({ ...responseFromApiCall }))
                    navigate('/')
                } else {
                    toast.error(responseFromApiCall.error.data.message)
                }
            } catch (err) {
                toast.error(err?.data?.message || err.console.error())
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
    <div className='min-h-screen py-20' >
            <div className='container mx-auto'>
                <div className='flex flex-col lg:flex-row w-10/12 lg:w-11/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden'>
                    <div className='w-full lg:w-1/2 flex flex-col items-centre justify-centre p-12 bg-no-repeat bg-center' style={{backgroundImage: `url(${VITE_REGISTER_IMAGE_DIR_PATH})`}}>
                        
                    </div>
                    <div className='w-full lg:w-1/2 py-10 px-12'>
                        <h2 className='text-3xl mb-3'>Login</h2>
                        <form onSubmit={submitHandler}>
                            <div className='mt-4'>
                                <input type='text' placeholder='Email' className='border border-grey-400 py-1 px-2 w-full' value={email} onChange={(e) => { setEmail(e.target.value);  setEmailError(loginValidateEmail(e.target.value))}} />
                                {emailError && <p className='text-red-500'>{emailError}</p>}
                            </div>
                            <div className='mt-4'>
                                <input type='password' placeholder='Password' className='border border-grey-400 py-1 px-2 w-full' value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(loginValidatePassword(e.target.value)) }} />
                                {passwordError && <p className='text-red-500'>{passwordError}</p>}
                            </div>
                            <div className='mt-3'>
                                <span><Link to='/forgotPassword'  className="btn btn-link">Forgot Password</Link></span>
                            </div>
                            <div className='mt-3'>
                                <button className='w-full py-3 text-center text-white' type='submit' style={{ backgroundColor: '#ffbe55' }}>Login</button>
                            </div>
                            <div className='mt-4 mb-3'>
                                <span>New Customer? <Link to='/register' className='font-semibold text-blue-500'>Register</Link></span>
                            </div>
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    // <FormContainer>
    //     <h1>Sign In</h1>

    //     <Form onSubmit={submitHandler}>
    //         <Form.Group className='my-2' controlId='email'>
    //             <Form.Label>Email Address</Form.Label>
    //             <Form.Control
    //             type='email'
    //             placeholder='Enter Email'
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             ></Form.Control>
    //         </Form.Group>

    //         <Form.Group className='my-2' controlId='password'>
    //             <Form.Label>Password</Form.Label>
    //             <Form.Control
    //             type='password'
    //             placeholder='Enter Password'
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             ></Form.Control>
    //         </Form.Group> 
    //         <Row className='py-3'>
    //             <Col>
    //                 <Link to='/forgotPassword'  className="btn btn-link">Forgot Password</Link>
    //             </Col> 
    //         </Row>

    //         {isLoading && <Loader />}  

    //         <Button type='submit' variant='primary' className='mt-3'>
    //               Sign In
    //         </Button>

    //         <Row className='py-3'>
    //             <Col>
    //                 New Customer? <Link to='/register'>Register</Link>
    //             </Col> 
    //         </Row>  
    //     </Form>  
    //     <GoogleOAuthProvider clientId="915783098784-vqrg4q9jh52kbfrh7u085shb3u4tqk45.apps.googleusercontent.com">
    //         <GoogleLogin
    //             onSuccess={credentialResponse => {
    //             const decoded = jwtDecode(credentialResponse.credential);
    //             console.log(decoded);
    //             {googleSubmit(decoded)}
    //         }}
    //         onError={() => {
    //             console.log('Login Failed');
    //         }}
    //         />
    //     </GoogleOAuthProvider>
    // </FormContainer>
  )
}

export default LoginScreen
