import { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import {useOtpVerifyMutation, useResendOtpMutation} from '../../slices/userApiSlice'
import { useNavigate } from 'react-router-dom'

const PasswordOtpVerify = () => {
    const [otp, setOtp] = useState('')
    const [showResendButton, setShowResendButton] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const [verifyOtp, { isLoading }] = useOtpVerifyMutation()
    const [resendOtpMutation, { isLoading: resendOtpLoading }] = useResendOtpMutation();
    const navigate = useNavigate()

    useEffect(() => {
        let timer;

        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    useEffect(() => {
        if (countdown === 0) {
            setShowResendButton(true);
        }
    }, [countdown]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await verifyOtp({ otp }).unwrap()
            navigate('/resetPassword')
        } catch (err) {
            setOtp('')
            if (err?.data?.message) {
                toast.error(err?.data?.message);
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
            setShowResendButton(false);
            setCountdown(60);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };


  return (
    <FormContainer>
        <h1>OTP verification</h1>
        {countdown > 0 ? (
                <p>OTP will expire in {countdown} seconds</p>
            ) : (
                <p>Time to enter OTP has expired. Click <b>Resend OTP</b> to get a new one.</p>
            )}
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
