import express from 'express'
import authenticateAdmin from '../middleware/adminAuthMiddleware.js'

const router = express.Router()

import {
    authAdmin,
    registerAdmin,
    logoutAdmin,
    getAdminProfile,
    updateAdminProfile,
    getAllUsers,
    blockUserData,
    unblockUserData,
    showReportedPosts,
    removeReportedPost,
    dashboardData
} from '../controllers/adminController.js'

import {
    getAllCategories,
    addCategoryData,
    updateCategoryData,
    unListCategoryData,
    reListCategoryData
} from '../controllers/categoryController.js'

router.post('/', registerAdmin)
router.post('/auth', authAdmin)
router.post('/logout', logoutAdmin)
router.route('/profile').get( authenticateAdmin, getAdminProfile ).put( authenticateAdmin, updateAdminProfile ); // The route is same, above line will use the specified controller according to the type of the request
router.post('/getUsers', authenticateAdmin, getAllUsers);
router.put('/blockUser', authenticateAdmin, blockUserData);
router.put('/unblockUser', authenticateAdmin, unblockUserData);
router.post('/getCategories', authenticateAdmin, getAllCategories);
router.post('/addCategory', authenticateAdmin, addCategoryData);
router.put('/updateCategory', authenticateAdmin, updateCategoryData);
router.put('/unListCategory', authenticateAdmin, unListCategoryData);
router.put('/reListCategory', authenticateAdmin, reListCategoryData);
router.get('/reportedPosts', authenticateAdmin, showReportedPosts);
router.put('/removeReportedPost', authenticateAdmin, removeReportedPost);
router.get('/dashboardData', authenticateAdmin, dashboardData);

export default router