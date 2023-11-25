import express from 'express'
import { authenticateUser } from '../middleware/userAuthMiddleware.js'
import nocache from 'nocache'

const router = express.Router()

router.use(nocache())

import {
    authUser,
    registerUser,
    verifyOtp,
    resendOtp,
    googleRegisterUser,
    forgotPassword,
    resetPassword,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getFollowedUsers,
    followArtist,
    unFollowArtist,
    showArtists
} from '../controllers/userController.js'

import {
    getAllCategories
} from '../controllers/categoryController.js'

import {
    createProduct,
    showPosts,
    postDetails,
    getUserPosts
} from '../controllers/productController.js'
import { multerUploadUserProfile, multerUploadProductImages } from '../config/multerConfig.js';


// router.all('*', checkUser)
router.post('/login', authUser)
router.post('/register', registerUser)
router.post('/otpVerify', authenticateUser, verifyOtp)
router.post('/resendOtp', authenticateUser, resendOtp)
router.post('/googleRegister', googleRegisterUser)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword', authenticateUser, resetPassword)
router.post('/logout', logoutUser)
router.get('/profile/:userId', authenticateUser, getUserProfile)
router.get('/userPosts/:userId', authenticateUser, getUserPosts)
router.put('/profile', authenticateUser, multerUploadUserProfile.single('profileImage'), updateUserProfile);
router.get('/getCategories', getAllCategories);
router.post('/addProduct', authenticateUser, multerUploadProductImages, createProduct);
router.get('/showPosts', showPosts);
router.get('/postDetails/:postId', authenticateUser, postDetails)
router.get('/followedUsers', authenticateUser, getFollowedUsers)
router.put('/followArtist/:artistId', authenticateUser, followArtist)
router.put('/unFollowArtist/:artistId', authenticateUser, unFollowArtist)
router.get('/getArtists', authenticateUser, showArtists);

export default router;
