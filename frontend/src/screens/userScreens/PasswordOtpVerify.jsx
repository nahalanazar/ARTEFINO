import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import {useOtpVerifyMutation, useResendOtpMutation} from '../../slices/userApiSlice'
import { useNavigate } from 'react-router-dom'

const PasswordOtpVerify = () => {
    const [otp, setOtp] = useState('')
    const [verifyOtp, { isLoading }] = useOtpVerifyMutation()
    const [resendOtpMutation, { isLoading: resendOtpLoading }] = useResendOtpMutation();
    const navigate = useNavigate()
    const [showResendButton, setShowResendButton] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await verifyOtp({ otp }).unwrap()
            navigate('/resetPassword')
        } catch (err) {
            if (err?.data?.message) {
                toast.error('OTP expired. Click "Resend OTP" to get a new one.');
                setShowResendButton(true)
            } else {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    const resendOtpHandler = async () => {
        try {
            toast.info('Resending OTP...');
            await resendOtpMutation().unwrap();
            toast.success('New OTP sent successfully!');
            setShowResendButton(false); // Hide the button after successfully resending OTP
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };


  return (
    <FormContainer>
        <h1>OTP verification</h1>
        <p>OTP will expire in One minute</p>
        <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='otp'>
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter OTP'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                ></Form.Control>
            </Form.Group> 
              
            {isLoading || resendOtpLoading ? <Loader /> : (
                    <Button type='submit' variant='primary' className='mt-3'>
                        Verify OTP
                    </Button>
                )}

                {showResendButton && (
                    <Button
                        variant='link'
                        className='mt-3'
                        onClick={resendOtpHandler}
                    >
                        Resend OTP
                    </Button>
                )}
        </Form>  
    </FormContainer>
  )
}

export default PasswordOtpVerify
