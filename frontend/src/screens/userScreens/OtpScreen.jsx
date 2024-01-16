import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useOtpVerifyMutation, useResendOtpMutation } from '../../slices/userApiSlice';
import { setCredentials } from '../../slices/userAuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OtpScreen = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showResendButton, setShowResendButton] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.userAuth);

    const [verifyOtp, { isLoading: verifyOtpLoading }] = useOtpVerifyMutation();
    const [resendOtpMutation, { isLoading: resendOtpLoading }] = useResendOtpMutation();

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

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
        // Show the resend button after one minute
        if (countdown === 0) {
            setShowResendButton(true);
        }
    }, [countdown]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await verifyOtp({ otp }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate('/');
        } catch (err) {
            setOtp('')
            if (err?.data?.message) {
                toast.error(err?.data?.message)
            } else {
                toast.error(err?.data?.message || err.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtpHandler = async () => {
        try {
            setIsLoading(true);
            toast.info('Resending OTP...');
            await resendOtpMutation().unwrap();
            toast.success('New OTP sent successfully!');
            setShowResendButton(false); 
            setCountdown(60); 
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        } finally {
            setIsLoading(false);
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
                <Form.Group className="my-2" controlId="otp">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </Form.Group>

                {(isLoading || verifyOtpLoading || resendOtpLoading) && <Loader />}

                <Button type="submit" variant="primary" className="mt-3" disabled={isLoading}>
                    Verify OTP
                </Button>

                {showResendButton && (
                    <Button
                        variant="link"
                        className="mt-3"
                        onClick={resendOtpHandler}
                        disabled={isLoading}
                    >
                        Resend OTP
                    </Button>
                )}
            </Form>
        </FormContainer>
    );
};

export default OtpScreen;
