import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { useResetPasswordMutation } from '../../slices/userApiSlice'

const ResetPasswordScreen = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    const { userInfo } = useSelector((state) => state.userAuth)
    const [resetPassword, { isLoading }] = useResetPasswordMutation()

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
                const res = await resetPassword({ password }).unwrap()
                console.log("res", res)
                if (res.message) {
                    navigate('/login')
                } else {
                    toast.error(res.error.data.message);
                }
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }


  return (
    <FormContainer>
        <h1>Reset Password</h1>

        <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Enter New Password'
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
                  Set New Password
            </Button>
  
        </Form>  
    </FormContainer>
  )
}

export default ResetPasswordScreen
