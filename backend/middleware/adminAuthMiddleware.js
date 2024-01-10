import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import AdminModel from '../models/adminModel.js';

const authenticateAdmin = asyncHandler( async (req, res, next) => {
    const tokenFromRequest = req.cookies.adminJwt;

    if (tokenFromRequest) {
        try {

            // Decode the jwt token using the secret key in the server
            const decodedTokenData = jwt.verify( tokenFromRequest, process.env.JWT_SECRET_KEY_ADMIN);

            // If the Token is valid, search the Db with the userId obtained after decoding jwt payload
            const requestUser = await AdminModel.findById(decodedTokenData.userId).select('-password');

            if (requestUser) {
                req.user = requestUser; // Set the request user with the user data fetched from the Db
                next(); // Proceed to next process
            }

        } catch (error) {
            res.status(401);
            throw new Error(`Authentication Failed. Invalid token found`);
        }
    } else {
        res.status(401);
        throw new Error(`Authentication Failed. No token found`);
    }
});


export default authenticateAdmin;

// authenticateAdmin.js




// import jwt from 'jsonwebtoken';
// import asyncHandler from 'express-async-handler';
// import Admin from '../models/adminModel.js';

// const authenticateAdmin = asyncHandler(async (req, res, next) => {
//   const tokenFromRequest = req.cookies.adminJwt;

//   if (tokenFromRequest) {
//     try {
//       const decodedTokenData = jwt.verify(tokenFromRequest, process.env.JWT_SECRET_KEY_USER);

//       const requestAdmin = await Admin.findById(decodedTokenData.adminId).select('-password');

//       if (requestAdmin) {
//         if (requestAdmin.is_blocked) {
//           res.status(401);
//           throw new Error(`Your Account is blocked.`);
//         }

//         req.user = requestAdmin;
        
//         // Role-based authorization
//         if (decodedTokenData.role === 'admin') {
//           // Admin is authorized
//           next();
//         } else {
//           res.status(403);
//           throw new Error('Role-based authorization failed. Admin is not authorized.');
//         }
//       }
//     } catch (error) {
//       res.status(401);
//       throw new Error(`Authentication failed. ${error.message}`);
//     }
//   } else {
//     res.status(401);
//     throw new Error(`Authentication failed. No token found.`);
//   }
// });

// export default authenticateAdmin 
