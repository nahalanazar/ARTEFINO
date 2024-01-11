import jwt from 'jsonwebtoken'
const generateUserToken = (res, userId) => {
    // Creating a new json web token with userId and secret key
    const jwtToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY_USER, { expiresIn: '30d' })

    const cookieOption = {
        httpOnly: true, // To prevent cookies from being accessed by client-side scripts
        secure: process.env.NODE_ENV !== 'production', // Value will be false in the development environment and hence http will be allowed in development
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // Sets expiry of cookie to 30 days
    }
    
    res.cookie('userJwt', jwtToken, cookieOption)
}

export default generateUserToken;

// import jwt from 'jsonwebtoken'

// const generateToken = (res, userId, userRole) => {
//   const token = jwt.sign({ userId, role: userRole }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   })
//   res.cookie('jwt', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== 'development',
//     sameSite: 'strict',
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//   })
// }

// export default generateToken

// generateUserToken.js
// import jwt from 'jsonwebtoken';

// const generateUserToken = (res, userId) => {
//   const jwtToken = jwt.sign({ userId, role: 'user' }, process.env.JWT_SECRET_KEY_USER, { expiresIn: '30d' });

//   const cookieOption = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== 'development',
//     sameSite: 'strict',
//     maxAge: 30 * 24 * 60 * 60 * 1000
//   };

//   res.cookie('userJwt', jwtToken, cookieOption);
// };

// export default generateUserToken;
