import asyncHandler from 'express-async-handler'
import adminModel from '../models/adminModel.js'
import Report from '../models/reportModel.js';
import generateAdminToken from '../utils/jwtConfig/adminJwtConfig/generateAdminToken.js'
import destroyAdminToken from '../utils/jwtConfig/adminJwtConfig/destroyAdminToken.js'
import { fetchAllUsers, deleteUser, blockUser, unblockUser } from '../utils/helpers/adminHelper.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// desc    Auth admin/set token
// route   POST /api/admin/auth
// access  Public
const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(401)
        throw new Error('Email or Password is missing in the request, Admin authentication failed.')
    }
    const admin = await adminModel.findOne({ email: email })
    let passwordValid = false

    if (admin) {
        passwordValid = await admin.matchPassword(password)
    }

    if (passwordValid) {
        generateAdminToken(res, admin._id)
        const registeredAdminData = {
            name: admin.name,
            email: admin.email
        }
        res.status(201).json(registeredAdminData)
    }
    if (!admin || !passwordValid) {
        res.status(401)
        throw new Error('Invalid Email or Password, Admin authentication failed.')
    }
})

// desc    Register admin
// route   POST /api/admin/register
// access  Public
const registerAdmin = asyncHandler ( async (req, res) => {
    const { name, email, password, adminRegistrationKey } = req.body;

    if ( !email || !password ) {
        res.status(401);
        throw new Error('Email or Password is missing in the request, Admin registration failed.');
    }

    if ( !adminRegistrationKey ) {
        res.status(401);
        throw new Error('No Admin Registration Access Code, Admin registration aborted.');
    }else{
        if(process.env.ADMIN_REGISTRATION_KEY !== adminRegistrationKey){
            res.status(401);
            throw new Error('Invalid Admin Registration Access Code, Admin registration failed.');
        }
    }

    const adminExists = await adminModel.findOne({ email });

    if (adminExists) {
        res.status(400);        
        throw new Error('Admin already exists.');
    }

    const user = await adminModel.create({
        name: name,
        email: email,
        password: password
    });
    
    if (user) {
        generateAdminToken(res, user._id); 

        const registeredUserData = {
            name: user.name,
            email: user.email
        }

        res.status(201).json(registeredUserData);
    }else {
        res.status(400);
        throw new Error('Invalid data, Admin registration failed.');
    }
});

// desc    Logout admin / clear cookie
// route   POST /api/admin/logout
// access  PUBLIC
const logoutAdmin = asyncHandler(async (req, res) => {
    console.log("logout")
    destroyAdminToken(res);
    res.status(200).json({message: 'Admin Logged Out'});
});

// desc    Get admin profile
// route   GET /api/admin/profile
// access  PRIVATE
const getAdminProfile = asyncHandler ( async (req, res) => {
    const user = {
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json({user});
});

// desc    Update admin profile
// route   PUT /api/admin/profile
// access  PRIVATE
const updateAdminProfile = asyncHandler ( async (req, res) => {
    const admin = await adminModel.findById(req.user._id);
    if (admin) {
    
        // Update the user with new data if found or keep the old data itself.
        admin.name = req.body.name || admin.name;
        admin.email = req.body.email || admin.email;

        // If request has new password, update the user with the new password
        if (req.body.password) {
            admin.password = req.body.password      
        }
        const updatedAdminData = await admin.save();

        // Send the response with updated user data
        res.status(200).json({
            name: updatedAdminData.name,
            email: updatedAdminData.email
        });
    } else {
        res.status(404);
        throw new Error("Requested Admin not found.");
    };
});

// desc    GET all users
// route   GET /api/admin/getUsers
// access  PRIVATE
const getAllUsers = asyncHandler(async (req, res) => {
    const usersData = await fetchAllUsers();
    if(usersData){
        res.status(200).json({ usersData });
    }else{
        res.status(404);
        throw new Error("Users data fetch failed.");
    }
});

// desc    DELETE user
// route   POST /api/admin/deleteUsers
// access  PRIVATE
const deleteUserData = asyncHandler( async (req, res) => {

    const userId = req.body.userId;

    const usersDeleteStatus = await deleteUser(userId);

    if(usersDeleteStatus.success){

        const response = usersDeleteStatus.message;

        res.status(200).json({ message:response });

    }else{

        res.status(404);

        const response = usersDeleteStatus.message;

        throw new Error(response);

    }

});

// desc    BLOCK user
// route   PUT /api/admin/blockUser
// access  PRIVATE
const blockUserData = asyncHandler( async (req, res) => {
    const userId = req.body.userId;
    const usersBlockStatus = await blockUser(userId);
    if(usersBlockStatus.success){
        const response = usersBlockStatus.message;
        res.status(200).json({ message:response });
    }else{
        res.status(404);
        const response = usersBlockStatus.message;
        throw new Error(response);
    }
});

// desc    UNBLOCK user
// route   PUT /api/admin/unblockUser
// access  PRIVATE
const unblockUserData = asyncHandler( async (req, res) => {
    const userId = req.body.userId;
    const usersBlockStatus = await unblockUser(userId);
    if(usersBlockStatus.success){
        const response = usersBlockStatus.message;
        res.status(200).json({ message:response });
    }else{
        res.status(404);
        const response = usersBlockStatus.message;
        throw new Error(response);
    }
});

// desc   Show reported posts for admin
// route  GET /api/admin/reportedPosts
// access PRIVATE 
const showReportedPosts = asyncHandler(async (req, res) => {
  
    const reports = await Report.find({})
        .populate({
            path: 'reportedPost',
            populate: {
                path: 'stores',
                model: 'User', 
            },
        })
        .populate('reporter')
        .exec();
    
    const reportedPosts = reports.map(report => ({
        title: report?.reportedPost?.title,
        postedUserName: report?.reportedPost?.stores.name, 
        reportedUserName: report?.reporter?.name,
        reportedDate: report.timestamp,
        reportedReason: report.reason,
        reportId: report._id,
        isReviewed: report.isReviewed
    }));
    res.status(200).json(reportedPosts);
   
});

// desc    Remove Reported Post
// route   PUT /api/admin/removeReportedPost
// access  PRIVATE
const removeReportedPost = asyncHandler(async (req, res) => {
    const reportId = req.body.reportId;
    const report = await Report.findById(reportId);
    report.isReviewed = true;
    await report.save();
    // Update the post status as removed
    const post = await Product.findById(report.reportedPost);
    post.isRemoved = true;
    await post.save();
    res.status(200).json({status: 'success', message: 'Report marked as reviewed'});
});

// desc    DashboardDatas
// route   GET /api/admin/dashboardDatas
// access  PRIVATE
const dashboardData = asyncHandler(async (req, res) => {
  // Get new users registered in the past 7 days
  const newUserCounts = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // Get new posts created in the past 7 days
  const newPostCounts = await Product.aggregate([
    {
      $match: {
        dateListed: {
          $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$dateListed',
          },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const responseData = {
    newUserCounts: newUserCounts.map((item) => ({ _id: item._id, count: item.count })),
    newPostCounts: newPostCounts.map((item) => ({ _id: item._id, count: item.count }))
  };
  res.json(responseData);
});

export {
    authAdmin,
    registerAdmin,
    logoutAdmin,
    getAdminProfile,
    updateAdminProfile,
    getAllUsers,
    deleteUserData,
    blockUserData,
    unblockUserData,
    showReportedPosts,
    removeReportedPost,
    dashboardData
}