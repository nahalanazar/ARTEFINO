import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateUserToken from '../utils/jwtConfig/userJwtConfig/generateUserToken.js'
import destroyUserToken from '../utils/jwtConfig/userJwtConfig/destroyUserToken.js'
import OTPVerification from '../models/otpVerificationModel.js'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs';

// desc   Auth user/set token
// route  POST /api/users/login
// access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(401)
        throw new Error('Email or Password is missing in the request, User authentication failed')
    }

    const user = await User.findOne({ email: email, verified: true })

    if (!user) {
        res.status(401);
        throw new Error('User not found, User authentication failed');
    }

    if (user.is_blocked) {
        res.status(401)
        throw new Error('Your account is blocked')
    }

    let passwordValid = false

    if (user) {
        passwordValid = await user.matchPassword(password)
    }
 
    if (passwordValid) {
        const existingToken = req.cookies.userJwt

        if (existingToken) {
            console.log("token exist")
            // If an existing token is found, destroy it
            destroyUserToken(res, existingToken);
        }


        generateUserToken(res, user._id)
        let registeredUserData = {
            name: user.name,
            email: user.email,
            id: user._id,
            followers: user.followers,
            following: user.following
        }
        if (user.profileImageName) {
            registeredUserData.profileImageName = user.profileImageName
        }
        res.status(201).json(registeredUserData)
    }
    
    if (!user || !passwordValid) {
        res.status(401)
        throw new Error('Invalid Email or Password, User authentication failed')
    }
})

// desc   Register new user
// route  POST /api/users/register
// access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, mobile } = req.body

    if (!name || !email || !password || !mobile) {
        res.status(400)
        throw new Error('Please provide all required fields');
    }

    const existingUser = await User.findOne({
        $or: [{ email: email }, { mobile: mobile }],
        verified: true
    });

    if (existingUser) {
        res.status(400)
        throw new Error('User already exists')
    }

    const existingUnverifiedUser = await User.findOne({
        $or: [{ email: email }, { mobile: mobile }],
        verified: false
    });

    if (existingUnverifiedUser) {
        // If an unverified account exists, delete it
        await existingUnverifiedUser.deleteOne();
    }

    if (!req.body.name || req.body.name.trim().length === 0) {
        throw new Error('Name is required')
      }
    if (/\d/.test(req.body.name)) {
        throw new Error('Name should not contain numbers')
      }
      const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
        throw new Error('Mobile Number should have 10 digits')
      }
    if (existingUser) {
        throw new Error('User already registered')
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
          throw new Error('Email Not Valid')
      }
      
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
          throw new Error('Password Should Contain atleast 8 characters, one number and a special character')
      }

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        mobile: mobile
    })
    if(user) {

        generateUserToken(res, user._id)
        sendOtpVerification(user, res)
        let registeredUserData = {
            name: user.name,
            email: user.email,
            id: user._id,
            followers: user.followers,
            following: user.following
        }
        res.status(200).json({"message":registeredUserData})
    } else {
        res.status(400)
        throw new Error('Invalid user data, User registration failed')
    }
})


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'artefinoproject@gmail.com',
        pass: 'obreyprhtaxnxrgg'
    }
})

const sendOtpVerification = asyncHandler(async ({_id, email}, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // mail options
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Your OTP is <b>${otp}</b></p><p>This code <b>expires in one minute</b></p>`
        };

        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newOtpVerification = new OTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 60000
        });

        // save otp record
        await newOtpVerification.save();

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log("it has an error", err);
            } else {
                console.log("email has send");
            }
        });

        // res.json({
        //     status: "Pending",
        //     message: "Otp send to email",
        //     data: {
        //         userId: _id,
        //         email
        //     }
        // });
    } catch (error) {
        res.json({
            status: "Failed",
            message: error.message
        });
    }
});


// desc   verify OTP
// route  POST /api/users/otpVerify
// access Public
const verifyOtp = asyncHandler(async (req, res) => {
    let otp = req.body.otp
    let userId = req.user._id
    if (!otp) {
        throw new Error ("Empty Otp details are not allowed")
    } else {
        const UserOtpVerificationRecords = await OTPVerification.find({ userId })
        if (UserOtpVerificationRecords.length <= 0) {
            throw new Error ("Account record doesn't exist or has been verified. Please signup or login")
        } else {
            const { expiresAt } = UserOtpVerificationRecords[0]
            const hashedOTP = UserOtpVerificationRecords[0].otp

            if (expiresAt < Date.now()) {
                await OTPVerification.deleteMany({ userId })
                throw new Error('Otp expired')
            } else {
                const validOTP = await bcrypt.compare(otp, hashedOTP)

                if (!validOTP) {
                    throw new Error ("Invalid OTP. Check your inbox.")
                } else {
                    await User.updateOne({ _id: userId }, { verified: true })
                    await OTPVerification.deleteMany({ userId })
                    // res.status(201).json('user email verified successfully')
                    let registeredUserData = {
                        name: req.user.name,
                        email: req.user.email,
                        id: req.user._id,
                        followers: req.user.followers,
                        following: req.user.following
                    }
                    res.status(201).json(registeredUserData)
                }
            }
        }
    }
})

// desc   Resend OTP
// route  POST /api/users/resendOtp
// access Public
const resendOtp = asyncHandler(async (req, res) => {
    console.log("user:", req.user._id)
    let userId = req.user._id
    let email = req.user.email

    if (!userId || !email) {
        throw new Error("No user Details")
    } else {
        await OTPVerification.deleteMany({ userId })
        sendOtpVerification({ _id: userId, email }, res)
        res.status(200).json({"message": "otp resended"})
    }
})

// desc   Register new user through Google
// route  POST /api/users/register
// access Public
const googleRegisterUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body

    if (!name || !email) {
        res.status(400)
            throw new Error('Please provide all required fields');
    }


    const existingUser = await User.findOne({email:email})

    if (existingUser) {
        generateUserToken(res, existingUser._id)
        let registeredUserData = {
            name: existingUser.name,
            email: existingUser.email,
            id: existingUser._id,
            followers: existingUser.followers,
            following: existingUser.following
        }
        if (existingUser.profileImageName) {
            registeredUserData.profileImageName = existingUser.profileImageName
        }
        if (existingUser.is_blocked) {
        res.status(401)
        throw new Error('Your account is blocked')
    }
    res.status(201).json(registeredUserData)
    } else {
        const user = await User.create({
        name: name,
        email: email
        })

        if (user) {
            generateUserToken(res, user._id)
            let registeredUserData = {
                name: user.name,
                email: user.email,
                id: user._id,
                followers: user.followers,
                following: user.following
            }
            res.status(201).json(registeredUserData)
        } else {
            res.status(400)
            throw new Error('Invalid user data, User registration failed')
        }
    }
})

// desc   Forgot Password
// route  POST /api/users/forgotPassword
// access Public
const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email, verified: true })
    console.log
    if (!user) {
        res.status(401);
        throw new Error('User not found, User authentication failed, Please SignUp again');
    } else {
        generateUserToken(res, user._id)
        sendOtpVerification(user, res)
        res.status(200).json({message: "email verified"})
    }
})

// desc   Reset Password
// route  POST /api/users/resetPassword
// access Public
const resetPassword = asyncHandler(async (req, res) => {
    const newPassword = req.body.password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        throw new Error("Password Should Contain atleast 8 characters,one number and a special character")
    }

    const user = await User.findById(req.user._id);

    if (req.body.password) {
        user.password = newPassword
    }

    const updatedUserData = await user.save();
    console.log("updatedUserData", updatedUserData)
    res.status(200).json({message: "password updated"})
})


// desc   logout user / clear cookie
// route  POST /api/users/logout
// access Public
const logoutUser = asyncHandler(async (req, res) => {
    destroyUserToken(res)
    res.status(200).json({message: 'User Logged out'})
})


// desc   Get User Profile 
// route  GET /api/users/profile/:userId
// access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const id = req.params.userId
    const user = await User.findById(id)
        .populate('followers', 'name profileImageName')
        .populate('following', 'name profileImageName')

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({user});
});


// desc   update profile page
// route  PUT /api/users/profile
// access Private
const updateUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        // Update the user with new data if found or keep the old data itself.
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If request has new password, update the user with the new password
        if (req.body.password) {
            user.password = req.body.password
        }

        if(req.file){
            user.profileImageName = req.file.filename || user.profileImageName;
        }

        const updatedUserData = await user.save();

        // Send the response with updated user data
        res.status(200).json({
            id: updatedUserData._id,
            name: updatedUserData.name,
            email: updatedUserData.email,
            profileImageName: updatedUserData.profileImageName
        });

    } else {
        res.status(404);
        throw new Error("Requested User not found.");
    };

});

// desc   Get  FollowedUsers
// route  GET /api/users/followedUsers
// access Private
const getFollowedUsers = asyncHandler(async (req, res) => {
    const id = req.user._id
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }
    const followers = await User.find({ _id: { $in: user.following } }) 
    res.status(200).json({followers});
});

// desc    Follow an artist
// route   PUT /api/users/followArtist/:artistId
// access  Private
const followArtist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const artistId = req.params.artistId;
    await User.findByIdAndUpdate(userId, { $addToSet: { following: artistId } });
    await User.findByIdAndUpdate(artistId, { $addToSet: { followers: userId } });
    res.status(200).json({ status: 'success', message: 'Followed artist successfully' });
})
 
// desc    UnFollow an artist
// route   PUT /api/users/unFollowArtist/:artistId
// access  Private
const unFollowArtist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const artistId = req.params.artistId;
    await User.findByIdAndUpdate(userId, { $pull: { following: artistId } });
    await User.findByIdAndUpdate(artistId, { $pull: { followers: userId } });
    res.status(200).json({ status: 'success', message: 'UnFollowed artist successfully' });
})

// desc    Remove an artist from Followers list
// route   PUT /api/users/removeArtist/:artistId
// access  Private
const removeArtist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const artistId = req.params.artistId;
    await User.findByIdAndUpdate(userId, { $pull: { followers: artistId } });
    await User.findByIdAndUpdate(artistId, { $pull: { following: userId } });
    res.status(200).json({ status: 'success', message: 'Removed artist successfully' });
})

// desc   Show some artists in home
// route  GET /api/users/getArtists
// access Private
const showArtists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get the current user's following list
  const currentUser = await User.findById(userId).populate('following');
  const followingList = currentUser.following.map(user => user._id);

  // Find artists who are not in the current user's following list
  const artists = await User.find({
    _id: { $ne: userId, $nin: followingList }
  }).limit(5);

  res.status(200).json(artists);
});

// desc   Show all artists except the current user in search
// route  GET /api/users?search=name/email
// access Private
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i'} }
            ]
        } : {}
    
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
})

const checkBlock = asyncHandler(async (req, res) => {
    const users = await User.findById(req.body.id)
    if (users) {
    res.status(200).json(users)
}
    
})

export {
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
    removeArtist,
    showArtists,
    allUsers,
    checkBlock
} 