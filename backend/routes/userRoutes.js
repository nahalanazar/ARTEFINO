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
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    getFollowedUsers,
    followArtist,
    unFollowArtist,
    removeArtist,
    showArtists,
    allUsers,
    checkBlock,
    fetchUserNotifications,
    acceptFollowRequest,
    rejectFollowRequest
} from '../controllers/userController.js'

import {
    getAllCategories
} from '../controllers/categoryController.js'

import {
    createProduct,
    showPosts,
    showLandingPosts,
    postDetails,
    getUserPosts,
    removePost,
    updatePost,
    likePost,
    unlikePost,
    commentPost,
    commentDelete,
    reportPost
} from '../controllers/productController.js'

import {
    fetchNotifications,
    deleteNotification
} from '../controllers/notificationController.js'

import {
    multerUploadUserProfile,
    multerUploadProductImages
} from '../config/multerConfig.js';

import {
    accessChat,
    fetchChats,
    sendMessage,
    allMessages
} from '../controllers/chatController.js'

// router.all('*', checkUser)
// router.get('/', authenticateUser, allUsers)
router.post('/login', authUser)
router.post('/register', registerUser)
router.post('/otpVerify', authenticateUser, verifyOtp)
router.post('/resendOtp', authenticateUser, resendOtp)
router.post('/googleRegister', googleRegisterUser)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword', authenticateUser, resetPassword)
router.post('/logout', logoutUser)
router.post('/getUsers', authenticateUser, getAllUsers);
router.get('/profile/:userId', authenticateUser, getUserProfile)
router.get('/userPosts/:userId', authenticateUser, getUserPosts)
// router.put('/profile', authenticateUser, multerUploadUserProfile.single('profileImage'), updateUserProfile)
router.post('/profile', authenticateUser, updateUserProfile)
router.get('/getCategories', getAllCategories)
router.post('/addProduct', authenticateUser, createProduct)
router.get('/showLandingPosts', showLandingPosts)
router.get('/showPosts', authenticateUser, showPosts)
router.get('/postDetails/:postId', authenticateUser, postDetails)
router.delete('/removePost/:postId', authenticateUser, removePost)
router.post('/updatePost/:postId', authenticateUser, updatePost)
router.post('/likePost/:postId', authenticateUser, likePost)
router.delete('/unlikePost/:postId', authenticateUser, unlikePost)
router.post('/commentPost/:postId', authenticateUser, commentPost)
router.delete('/commentDelete/:postId', authenticateUser, commentDelete)
router.post('/reportPost', authenticateUser, reportPost);
router.get('/followedUsers', authenticateUser, getFollowedUsers)
router.put('/followArtist/:artistId', authenticateUser, followArtist)
router.put('/unFollowArtist/:artistId', authenticateUser, unFollowArtist)
router.put('/removeArtist/:artistId', authenticateUser, removeArtist)
router.get('/getArtists', authenticateUser, showArtists)
router.post('/accessChat', authenticateUser, accessChat)
router.get('/fetchChats', authenticateUser, fetchChats)
router.post('/sendMessage', authenticateUser, sendMessage)
router.get('/allMessages/:chatId', authenticateUser, allMessages)
router.put('/checkBlock', checkBlock)
router.get('/allNotifications', authenticateUser, fetchNotifications)
router.put('/deleteNotification/:notificationId', authenticateUser, deleteNotification)
router.get('/userNotifications', authenticateUser, fetchUserNotifications)
router.put('/acceptRequest/:artistId', authenticateUser, acceptFollowRequest)
router.put('/rejectRequest/:artistId', authenticateUser, rejectFollowRequest)


export default router;
