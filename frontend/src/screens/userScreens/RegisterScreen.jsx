import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import { Form, Button, Row, Col } from 'react-bootstrap'
// import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { useRegisterMutation, useGoogleRegisterMutation } from '../../slices/userApiSlice'
import { setCredentials } from '../../slices/userAuthSlice'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { validateName, validateEmail, validateMobile, validatePassword, validateConfirmPassword } from '../../components/userComponents/validation';

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const VITE_REGISTER_IMAGE_DIR_PATH = import.meta.env.VITE_REGISTER_IMAGE_DIR_PATH


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

    // const submitHandler = async (e) => {
    //     e.preventDefault();
    //     if (password !== confirmPassword) {
    //         toast.error('Passwords do not match')
    //     } else {
    //         try {
    //             const res = await register({ name, mobile, email, password }).unwrap()
    //             console.log("res", res)
    //             if (res.message) {
    //                 navigate('/otpVerify')
    //             } else {
    //                 toast.error(res.error.data.message);
    //             }
    //         } catch (err) {
    //             toast.error(err?.data?.message || err.error)
    //         }
    //     }
    // }

    const submitHandler = async (e) => {
    e.preventDefault();

    // Validate Name
    const nameValidationResult = validateName(name);
    setNameError(nameValidationResult);

    // Validate Email
    const emailValidationResult = validateEmail(email);
    setEmailError(emailValidationResult);

    // Validate Mobile
    const mobileValidationResult = validateMobile(mobile);
    setMobileError(mobileValidationResult);

    // Validate Password
    const passwordValidationResult = validatePassword(password);
    setPasswordError(passwordValidationResult);

    // Validate Confirm Password
    const confirmPasswordValidationResult = validateConfirmPassword(password, confirmPassword);
    setConfirmPasswordError(confirmPasswordValidationResult);

    // Check if there are no errors before submitting the form
    if (
        !nameValidationResult &&
        !emailValidationResult &&
        !mobileValidationResult &&
        !passwordValidationResult &&
        !confirmPasswordValidationResult
    ) {
        try {
            const res = await register({ name, mobile, email, password }).unwrap();
            console.log("res", res);
            if (res.message) {
            navigate('/otpVerify');
            } else {
            toast.error(res.error.data.message);
            }
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
  };

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
                        <h2 className='text-3xl mb-3'>Register</h2>
                        <p className='mb-3'>Create your account. It's free and take a minute</p>
                        <form onSubmit={submitHandler}>
                            <div>
                                <input type='text' placeholder='Name' className='border border-grey-400 py-1 px-2 w-full' value={name} onChange={(e) => { setName(e.target.value); setNameError(validateName(e.target.value))}} />
                                {nameError && <p className='text-red-500'>{nameError}</p>}
                            </div>
                            <div className='mt-4'>
                                <input type='text' placeholder='Email' className='border border-grey-400 py-1 px-2 w-full' value={email} onChange={(e) => { setEmail(e.target.value);  setEmailError(validateEmail(e.target.value))}} />
                                {emailError && <p className='text-red-500'>{emailError}</p>}
                            </div>
                            <div className='mt-4'>
                                <input type='text' placeholder='Mobile' className='border border-grey-400 py-1 px-2 w-full' value={mobile} onChange={(e) => { setMobile(e.target.value); setMobileError(validateMobile(e.target.value)) }} />
                                {mobileError && <p className='text-red-500'>{mobileError}</p>}
                            </div>
                            <div className='mt-4'>
                                <input type='password' placeholder='Password' className='border border-grey-400 py-1 px-2 w-full' value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(validatePassword(e.target.value)) }} />
                                {passwordError && <p className='text-red-500'>{passwordError}</p>}
                            </div>
                            <div className='mt-4'>
                                <input type='password' placeholder='Confirm Password' className='border border-grey-400 py-1 px-2 w-full' value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(validateConfirmPassword(password, e.target.value)) }} />
                                {confirmPasswordError && <p className='text-red-500'>{confirmPasswordError}</p>}
                            </div>
                            {isLoading && <Loader />}
                            <div className='mt-5'>
                                <button className='w-full py-3 text-center text-white' type='submit' style={{ backgroundColor: '#ffbe55' }}>Send OTP</button>
                            </div>
                            <div className='mt-4 mb-3'>
                                <span>Already have an account? <Link to='/login'  className='font-semibold text-blue-500'>Login</Link></span>
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
    //     <h1>Sign Up</h1>

    //     <Form onSubmit={submitHandler}>
    //         <Form.Group className='my-2' controlId='name'>
    //             <Form.Label>Name</Form.Label>
    //             <Form.Control
    //             type='text'
    //             placeholder='Enter Name'
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //             ></Form.Control>
    //         </Form.Group>
              
    //         <Form.Group className='my-2' controlId='mobile'>
    //             <Form.Label>Mobile</Form.Label>
    //             <Form.Control
    //             type='text'
    //             placeholder='Enter Mobile'
    //             value={mobile}
    //             onChange={(e) => setMobile(e.target.value)}
    //             ></Form.Control>
    //         </Form.Group>

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
              
    //         <Form.Group className='my-2' controlId='confirmPassword'>
    //             <Form.Label>Confirm Password</Form.Label>
    //             <Form.Control
    //             type='password'
    //             placeholder='Confirm Password'
    //             value={confirmPassword}
    //             onChange={(e) => setConfirmPassword(e.target.value)}
    //             ></Form.Control>
    //         </Form.Group>
              
    //         {isLoading && <Loader />}

    //         <Button type='submit' variant='primary' className='mt-3'>
    //               Send OTP
    //         </Button>

    //         <Row className='py-3'>
    //             <Col>
    //                 Already have an account? <Link to='/login'>Login</Link>
    //             </Col> 
    //         </Row>  
            // <GoogleOAuthProvider clientId="915783098784-vqrg4q9jh52kbfrh7u085shb3u4tqk45.apps.googleusercontent.com">
            //     <GoogleLogin
            //         onSuccess={credentialResponse => {
            //         const decoded = jwtDecode(credentialResponse.credential);
            //         console.log(decoded);
            //         {googleSubmit(decoded)}
            //     }}
            //     onError={() => {
            //         console.log('Login Failed');
            //     }}
            //     />
            // </GoogleOAuthProvider>
    //     </Form>  
    // </FormContainer>
    // <svg className='w-5 inline-block' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    //     <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    // </svg>
  )
}

export default RegisterScreen
