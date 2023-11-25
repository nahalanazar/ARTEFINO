import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { useForgotPasswordMutation } from '../../slices/userApiSlice'
import {toast} from 'react-toastify'
import Loader from '../../components/Loader'
import { useNavigate } from 'react-router-dom'

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('')
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await forgotPassword({ email }).unwrap()
            console.log("res", res)
            navigate('/passwordOtpVerify')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
    

  return (
    <FormContainer>
        <h1>Forgot Password</h1>
        <p>To reset Password, please verify your email</p>
        <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group> 
              
            {isLoading && <Loader />}
              
            <Button type='submit' variant='primary' className='mt-3'>
                Send OTP
            </Button>
                
        </Form>  
    </FormContainer>
  )
}

export default ForgotPasswordScreen
